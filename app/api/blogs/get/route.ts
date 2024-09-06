import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../../util/mongo";
import { BlogModel } from "../../../schemas/Blog";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

type BlogData = {
  id: string;
  title: string;
  content: string;
  background: string;
  author: string;
  date: string;
};

type ResponseData = {
  status: number;
  blogs: [BlogData];
};
/**
 * Handles GET requests to this API endpoint.
 *
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  await connectMongo();

  const data = await BlogModel.find({}).sort({ date: -1 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const testmode = searchParams.get("test");
  if (data === null) {
    return NextResponse.json({
      status: 404,
      message: "Blogs did not have a database",
    });
  } else {
    if (testmode) {
      const d = new BlogModel({
        title: "Beta Docs",
        author: "Only Cheeini",
        content: "Release of GreesyAI",
        background: "bg-gradient-to-br from-gray-700 to-cyan-400",
        id: "tests",
      });
      d.save()
        .then((savedUser) => {})
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    }

    if (id) {
      const blogPost = data.filter((x) => x.id === id);
      if (blogPost.length === 0)
        return NextResponse.json({ message: "not found" });
      return NextResponse.json(blogPost);
    } else {
      return NextResponse.json({
        status: 200,
        message: "success",
        blogs: data,
      });
    }
  }
}
/**
 * Handles POST requests to this API endpoint.
 *
 * @param req The incoming request object.
 * @param res The outgoing response object.
 */
export function POST() {
  return "";
}
