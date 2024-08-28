import models from "../../../../../models.json";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../../schemas/User";
import connectMongo from "../../../../../util/mongo";
import {handleGreesyAi} from "../../../../../util/handleGreesyAi";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 20,
}
async function fetchFromProvider(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Provider response not OK: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Fetch error: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}

async function getProviderAndModel(modelName: string) {
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

async function streamToString(stream: ReadableStream) {
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
/**
 * Handles POST requests to this API endpoint.
 *
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();
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

  const { model, messages, max_tokens, top_p, top_k, temperature } =
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
  if(userdata.limits.left === 0 || userdata.limits.left < 10) {
    return NextResponse.json(
      {
        message: "You're out of credits.",
        tip: "ai.greesy.one/discord",
        code: "INSUFFICENT_CREDITS"
      }, 
      { status: 403 })
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
        return NextResponse.json(
          { message: "This model requires a Premium Account" },
          { status: 402 },
        );
      }

      try {
        let response;
        switch (provider.provider) {
          case "greesyai":
            response = await handleGreesyAi(model,messages)
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

        return NextResponse.json({
          id: response.id,
          model: model,
          object: response.object,
          created: response.created,
          choices: response.choices,
        });
      } catch (error) {
        console.error(
          `Error with provider ${provider.provider}:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    throw new Error("No available providers left.");
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { error: "Provider Error: Unable to process the request." },
      { status: 500 },
    );
  }
}
/**
 * Handles GET requests to this API endpoint.
 *
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextResponse.json(
      { message: "GET request not implemented" },
      { status: 501 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
