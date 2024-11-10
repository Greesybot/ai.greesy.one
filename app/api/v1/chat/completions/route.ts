import models from "../../../../../data/output.json";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import UserModel from "../../../../schemas/User";
import connectMongo from "../../../../../util/mongo";
import { handleGreesyAi } from "../../../../../util/handleGreesyAi";

const rateLimiter = {
  windowSize: 60000, // 1 minute in milliseconds
  maxRequests: 15, // 5 requests per window
};
const dataLimit = new Map();

async function limitByApiKey(apiKey) {
  const now = Date.now();

  // Get the user's rate limit details from the Map, or initialize if it doesn't exist
  let limitData = dataLimit.get(apiKey);

  // If no data exists for the API key, initialize it
  if (!limitData) {
    limitData = {
      left: rateLimiter.maxRequests,
      lastRequest: now,
    };
    dataLimit.set(apiKey, limitData);
  }

  const timeSinceLastRequest = now - limitData.lastRequest;

  // Reset window if the time since the last request exceeds the window size
  if (timeSinceLastRequest > rateLimiter.windowSize) {
    limitData.left = rateLimiter.maxRequests;
    limitData.lastRequest = now;
    dataLimit.set(apiKey, limitData); // Update the Map
    return false; // Not rate-limited
  }

  // Check if the user has remaining requests
  if (limitData.left <= 0) return true; // Rate-limited

  // Deduct a request from the remaining limit and update the last request time
  limitData.left -= 1;
  limitData.lastRequest = now;
  dataLimit.set(apiKey, limitData); // Update the Map

  return false; // Not rate-limited
}

async function fetchFromProvider(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(
        `Provider response not OK: ${response.status} ${response.statusText}`
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
  if (!modelData) throw new Error(`Model not found: ${modelId}`);
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
    const authHeader = headers().get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "The API Key is needed to access the API." },
        { status: 401 }
      );
    }
    const apiKey = authHeader.split("Bearer ")[1];
    const isRateLimited = await limitByApiKey(apiKey);

    if (isRateLimited) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const userdata = await UserModel.findOne({ apiKey });
    if (!userdata) {
      return NextResponse.json(
        { error: "The API Key doesn't exist in the database" },
        { status: 403 }
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
        { status: 400 }
      );
    }

    const { premium, providers, model: modelInfo } = getProviderAndModel(model);
    if (premium && !userdata.premium) {
      return NextResponse.json(
        { error: "This model requires a Premium Subscription" },
        { status: 402 }
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
              }
            );
            break;
          case "pocketai":
            response = await fetchFromProvider(
              "https://pocket.holabo.co/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.POCKETAI_API_KEY}`,
                },
                body: JSON.stringify({
                  model: modelInfo.name.split("/")[1],
                  tools,
                  messages,
                  max_tokens: max_tokens ?? 1024,
                  temperature: temperature ?? 1,
                  top_p,
                  response_format,
                  top_k,
                }),
              }
            );
            break;
          default:
            console.warn(`Provider ${provider} not supported`);
            continue;
        }

        if (!response || !response.choices || response.choices.length === 0) {
          console.error(`Invalid response from provider ${provider}`);
          continue;
        }

        return NextResponse.json(
          {
            id: response.id,
            model: model,
            object: response.object,
            created: response.created,
            choices: response.choices,
          },
          {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      } catch (error) {
        console.error(`Error with provider ${provider}: ${error.message}`);
      }
    }

    throw new Error("No available providers succeeded.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return NextResponse.json(
      { error: "Provider Error: Unable to process the request." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  return NextResponse.json(
    { message: "GET request not implemented" },
    { status: 501 }
  );
}