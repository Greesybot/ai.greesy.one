import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../../util/mongo";
import { BlogModel } from "../../../schemas/Blog";
import { NextResponse } from "next/server";

type BlogData = {
  id: string;
  title: string;
  content: string;
  background: string;
  author: string;
  date: string; // Ensure this is in ISO string format for sorting
};

type ResponseData = {
  status: number;
  message?: string;
  blogs?: BlogData[];
};

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  await connectMongo();

  const { searchParams } = new URL(req.url || "", `http://${req.headers.host}`);
  const id = searchParams.get("id");
  const testmode = searchParams.get("test");

  try {
    if (testmode) {
      // Create a test blog post if `testmode` is enabled
      const testBlog = new BlogModel({
        title: "Beta Docs",
        author: "Only Cheeini",
        content: "Release of GreesyAI",
        background: "bg-gradient-to-br from-gray-700 to-cyan-400",
        id: "tests",
        date: new Date(), // Set current date
      });
      await testBlog.save();
    }

    const blogs = await BlogModel.find({}).sort({ date: -1 }).exec();

    if (id) {
      const blogPost = blogs.find((x) => x.id === id);
      if (!blogPost) {
        return NextResponse.json({
          status: 404,
          message: "Blog not found",
        });
      }
      return NextResponse.json({
        status: 200,
        blogs: [blogPost],
      });
    } else {
      return NextResponse.json({
        status: 200,
        blogs,
      });
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export function POST(req: NextApiRequest, res: NextApiResponse) {
  // Implement POST request handling if needed
  return res.status(405).json({ message: "Method not allowed" });
}