import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

type ModelData = {
  id: string;
  object: ["chat.completion", "text.moderations", "images.generations"];
  description: string;
  image: string;
  created: number;
  owner: string;
  provider: string;
};

type ResponseData = {
  object: string;
  data: ModelData[];
};

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'output.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const models = JSON.parse(jsonData);

    if (!jsonData) {
      throw new Error('Invalid JSON file format');
    }

    return NextResponse.json(models, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching models:", err.message || err);
    return NextResponse.json(
      { object: "error", message: "Failed to fetch the models from file", error: err.message || err },
      { status: 403 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json(
      { message: "POST request not implemented" },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error handling POST request:", error.message || error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error },
      { status: 500 }
    );
  }
}