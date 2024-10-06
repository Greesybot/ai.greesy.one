import models from "../../../../../data/output.json";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import UserModel from "../../../../schemas/User";
import connectMongo from "../../../../../util/mongo";
import { handleGreesyAi } from "../../../../../util/handleGreesyAi";

const idToRequestCount = new Map<string, number>();
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 10000,
  maxRequests: 10,
};

const limit = (ip: string) => {
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.clear();
  }

  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};

async function fetchFromProvider(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        `Provider response not OK: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Provider response not OK: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
}

function getProviderAndModel(modelId) {
  const modelData = models.data.find((model) => model.id === modelId);

  if (!modelData) {
    throw new Error(`Model not found: ${modelId}`);
  }

  return {
    premium: modelData.premium,
    providers: modelData.providers,
    model: {
      name: modelData.id,
      object: modelData.object,
      description: modelData.description,
      created: modelData.created,
      owned_by: modelData.owned_by,
    },
  };
}

export async function POST(req) {
  try {
    await connectMongo();
    const ip = req.ip ?? headers().get("X-Forwarded-For") ?? "unknown";
    const isRateLimited = limit(ip);

    /*if (isRateLimited) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }*/

    const authHeader = headers().get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "The API Key is needed to access the API." },
        { status: 401 },
      );
    }

    const requestData = await req.json();
    const {
      model,
      tools,
      messages,
      response_format,
      max_tokens,
      top_p,
      top_k,
      temperature,
    } = requestData;

    if (!model) {
      return NextResponse.json(
        { error: "Invalid Params: model is required" },
        { status: 400 },
      );
    }
console.log(authHeader.split("Bearer ")[1])
    const userdata = await UserModel.findOne({
      apiKey: authHeader.split("Bearer ")[1],
    });
    if (!userdata) {
      return NextResponse.json(
        { error: "The API Key doesn't exist in the database" },
        { status: 403 },
      );
    }
    if (userdata.limits.left === 0 || userdata.limits.left < 10) {
      return NextResponse.json(
        {
          error: "You're out of credits.",
          code: "INSUFFICIENT_CREDITS",
        },
        { status: 403 },
      );
    }

    const { premium, providers, model: modelInfo } = getProviderAndModel(model);

    if (premium && !userdata.premium) {
      return NextResponse.json(
        { error: "This model requires a Premium Subscription" },
        { status: 402 },
      );
    }
  
    for (const provider of providers) {
      try {
        
        let response;
        switch (provider) {
          case "greesyai":
            response = await handleGreesyAi(model, messages);
            break;
          case "openrouter":
            response = await fetchFromProvider(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                  model: modelInfo.name,
                  tools,
                  messages,
                  max_tokens: max_tokens ?? 1024,
                  temperature: temperature ?? 1,
                  top_p,
                  response_format,
                  top_k,
                }),
              },
            );
            break;
          case "deepseek":
            response = await fetchFromProvider(
              "https://api.deepseek.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                },
                body: JSON.stringify({
                  model: modelInfo.name,
                  tools,
                  messages,
                  max_tokens: max_tokens ?? 1024,
                  temperature: temperature ?? 1,
                  top_p,
                  response_format,
                  top_k,
                }),
              },
            );
            break;
          case "github":
            response = await fetchFromProvider(
              "https://models.inference.ai.azure.com/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                },
                body: JSON.stringify({
                  model: model?.split("/")[1],
                  messages,
                  tools,
                }),
              },
            );
            break;
          case "pocketai":
          case "lepton":
          case "deepinfra":
            console.warn(`Provider ${provider} not implemented yet`);
            continue;
          default:
            console.warn(`Provider ${provider} not supported`);
            continue;
        }

        if (!response || !response.choices || response.choices.length === 0) {
          console.error(`Invalid response from provider ${provider}`);
          continue;
        }

        await UserModel.findByIdAndUpdate(userdata._id, {
          $inc: { "limits.0.left": -10, "limits.0.total": -10 },
        });
        
      /*  const log = await fetch(process.env.WEBHOOKURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "GreesyAI Moderation Logs",          // Title of the embed
            description: `\n- Model: ${model}\n- Content (user): ${messages}\n- Content (modrl): ${response.choices[0].content.split(100)}`,  // Description text
            color: parseInt(65280, 16), // Embed color in decimal format (hex)
          },
        ],
      }),
    });*/
        return NextResponse.json({
          id: response.id,
          model: model,
          object: response.object,
          created: response.created,
          choices: response.choices,
        });
      } catch (error) {
        console.error(`Error with provider ${provider}: ${error.message}`);
      }
    }

    throw new Error("No available providers succeeded.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return NextResponse.json(
      { error: "Provider Error: Unable to process the request." },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  return NextResponse.json(
    { message: "GET request not implemented" },
    { status: 501 },
  );
}
