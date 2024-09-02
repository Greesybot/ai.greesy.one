import models from "../../../../../models.json";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import UserModel from "../../../../schemas/User";
import connectMongo from "../../../../../util/mongo";
import { handleGreesyAi } from "../../../../../util/handleGreesyAi";

const idToRequestCount = new Map<string, number>(); 
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 10000,
  maxRequests: 5,
};

const limit = (ip: string) => {

  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.set(ip, 0);
  }

  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    externalResolver: true,
  },
};

async function fetchFromProvider(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Provider response not OK: ${response.statusText}`);
    }
   
    return await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
}

async function getProviderAndModel(modelName) {
  for (const provider of models) {
    let model = provider.models.find((m) => m.name === modelName);
    if (!model) {
      const strippedModelName = modelName.split("/").pop() || "";
      model = provider.models.find((m) => m.name === strippedModelName);
    }
    if (model) {
      return {
        premium: model.premium ?? false,
        provider: provider.provider,
        model,
      };
    }
  }
  throw new Error("Model not found");
}

async function streamToString(stream) {
  const chunks = [];
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function POST(req) {
  await connectMongo();
  const ip = req.ip ?? headers().get('X-Forwarded-For') ?? 'unknown';
  const isRateLimited = limit(ip);

  if (isRateLimited)
    return NextResponse.json({ error: 'You are rate limited.' }, { status: 429 });
    
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed, only POST requests are accepted." },
      { status: 405 },
    );
  }

  const authHeader = headers().get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "The API Key is needed to access the API." },
      { status: 401 },
    );
  }

  const { model, messages,response_format, max_tokens, top_p, top_k, temperature } =
    await req.json();
  if (!model) {
    return NextResponse.json(
      { message: "Invalid Params", tip: "https://ai.greesy.one/blog/" },
      { status: 400 },
    );
  }

  const userdata = await UserModel.findOne({ apiKey: authHeader });
  if (!userdata) {
    return NextResponse.json(
      { message: "The API Key doesn't exist in the database" },
      { status: 403 },
    );
  }
  if (userdata.limits.left === 0 || userdata.limits.left < 10) {
    return NextResponse.json(
      {
        message: "You're out of credits.",
        tip: "ai.greesy.one/discord",
        code: "INSUFFICIENT_CREDITS"
      },
      { status: 403 },
    );
  }

  try {
    const providers = models.filter((provider) =>
      provider.models.some((m) => m.name === model),
    );

    if (providers.length === 0) {
      throw new Error("No providers found for the model");
    }

    for (const provider of providers) {
      if (provider.premium && !userdata.premium) {
        throw new Error("Premium Required Model")
        return NextResponse.json(
          { message: "This model requires a Premium Account" },
          { status: 402 },
        );
      }

      try {
        let response;
        switch (provider.provider) {
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
                  model: provider.models.find((m) => m.name === model)?.name,
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

          case "lepton":
            response = await fetchFromProvider(
              "https://lepton.ai/api/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.LEPTON_API_KEY}`,
                },
                body: JSON.stringify({
                  model: provider.models.find((m) => m.name === model)?.name,
                  messages,
                }),
              },
            );
            break;

          default:
            throw new Error("Provider not supported");
        }

await UserModel.findByIdAndUpdate(userdata._id, {
      $inc: { "limits.0.left": -10, "limits.0.total": -10 },
    });
console.log(response)
        if(!response.choices || response.choices.length === null) throw new Error("response doesnt have choices array.")
        return NextResponse.json({
          id: response.id,
          model: model,
          object: response.object,
          created: response.created,
          choices: response.choices,
        });
      } catch (error) {
        console.error(`Error with provider ${provider.provider}: ${error.message}`);
      }
    }

    throw new Error("No available providers left.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return NextResponse.json(
      { error: "Provider Error: Unable to process the request." },
      { status: 500 },
    );
  }
}
export async function GET(req) {
  try {
    return NextResponse.json(
      { message: "GET request not implemented" },
      { status: 501 },
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}