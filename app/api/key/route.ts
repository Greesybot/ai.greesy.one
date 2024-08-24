import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../../util/mongo';
import UserModel from '../../schemas/User';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

type ResponseData = {
  key: string;
};

/**
 * Handles GET requests to this API endpoint.
 * 
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const h = headers();
    if (!h) {
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

    const email = h.get("Authorization");
    const force = h.get("X-Force-UI");

    if (force === process.env.key) {
      return NextResponse.json({ key: email });
    }

    await connectMongo();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    return NextResponse.json({ key: user.apiKey });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Handles POST requests to this API endpoint.
 * 
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    return NextResponse.json({ message: "POST request not implemented" }, { status: 501 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}