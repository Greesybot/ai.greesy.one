import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../util/mongo";
import UserModel from "../../schemas/User";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import cors from "../../middleware/cors";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import { getToken } from "next-auth/jwt";
// Connect to the database when the server starts

/**
 * Handles GET requests to this API endpoint.
 *
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();
  const data = await getToken({ req });
  console.log(data);
  if (!data) {
    return NextResponse.json(
      { message: "You do not have access to do this." },
      { status: 401 },
    );
  }

  try {
    const h = headers();
    if (!h) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }

    const email = h.get("Authorization");
    const force = h.get("X-Force-UI");

    if (force === process.env.key) {
      return NextResponse.json({ key: email });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ key: user.apiKey });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to this API endpoint.
 *
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextResponse.json(
      { message: "POST request not implemented" },
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
