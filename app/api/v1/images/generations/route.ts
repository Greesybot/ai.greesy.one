import models from "../../../../../data/output.json"; // Adjust path if necessary
import { TextToImage } from "deepinfra";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import UserModel from "../../../../schemas/User";
import connectMongo from "../../../../../util/mongo";
import { getProviderAndModel } from "../../../../../util/provider"; // Adjust path accordingly

const rateLimiter = {
  windowSize: 60000, // 1 minute in milliseconds
  maxRequests: 15, // 15 requests per window
};
const dataLimit = new Map<string, { left: number; lastRequest: number }>();

async function limitByApiKey(apiKey: string): Promise<boolean> {
  const now = Date.now();

  let limitData = dataLimit.get(apiKey);

  if (!limitData) {
    limitData = {
      left: rateLimiter.maxRequests,
      lastRequest: now,
    };
    dataLimit.set(apiKey, limitData);
  }

  const timeSinceLastRequest = now - limitData.lastRequest;

  if (timeSinceLastRequest > rateLimiter.windowSize) {
    limitData.left = rateLimiter.maxRequests;
    limitData.lastRequest = now;
    dataLimit.set(apiKey, limitData);
    return false;
  }

  if (limitData.left <= 0) return true;

  limitData.left -= 1;
  limitData.lastRequest = now;
  dataLimit.set(apiKey, limitData);

  return false;
}

export async function POST(req: Request) {
  try {
    await connectMongo();

    const authHeader = headers().get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "The API Key is needed to access the API." },
        { status: 401 }
      );
    }

    const apiKeyMatch = authHeader.match(/^Bearer (.+)$/);
    if (!apiKeyMatch) {
      return NextResponse.json(
        { error: "Invalid Authorization header format." },
        { status: 400 }
      );
    }

    const apiKey = apiKeyMatch[1];
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

    const body = await req.json();
    const { model, ...restBody } = body;

    if (!model) {
      return NextResponse.json(
        { error: "Invalid Params: model is required" },
        { status: 400 }
      );
    }

    // Validate if model exists in output.json and is of type "images.generations"
    const modelExists = models?.data.find((m: { id: string; object: string }) => m.id === model && m.object === "images.generations");

    if (!modelExists) {
      return NextResponse.json(
        { error: "Invalid or unsupported model name provided." },
        { status: 400 }
      );
    }

    const deepinfraModel = new TextToImage(model, process.env.DEEPINFRA_API_KEY); // Replace with actual API Key from environment

    const response = await deepinfraModel.generate({
      prompt: body.prompt,
      height: body.height,
      width: body.width,
      prompt_upsampling: true,
      seed: body.seed
    });

    if (response?.image_url) {
      


        return NextResponse.json({ data: response.image_url }, { status: 200 });

      
    } else {
      
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}