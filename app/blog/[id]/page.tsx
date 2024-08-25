"use client";
import BlogCard from "../../components/Blog/Card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { richTextToJsx } from "@madebyconnor/rich-text-to-jsx";
import remarkGfm from "remark-gfm";
import Nav from "../../components/Main/Nav";
import { TiWarning } from "react-icons/ti";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import { useState, useEffect } from "react";

export default function Blog({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/blogs/get?id=${params.id}`);
        const result = await response.json();
        if (result.message) {
          router.push("/404");
        } else {
          setLoading(false);
          setData(result);
          setStatus(response.status);
        }
      } catch (error) {
        setStatus(500);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex mx-auto justify-center h-screen w-full">
        <Skeleton height={20} width={200} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex mx-auto justify-center">
        <h1>No data found</h1>
      </div>
    );
  }

  return (
    <>
      <Nav />
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <div
            key={index}
            className="flex z-0 justify-between px-6 py-4 flex-col h-screen w-full"
          >
            <div className="flex flex-col space-y-4 isolate ">
              <button className="inline-flex items-center text-gray-200 font-bold font-sans">
                <span className="text-gray-500 -ml-4">
                  <MdKeyboardArrowLeft />
                </span>
                Go Back
              </button>
              <div className="flex flex-col space-y-4 pt-12 -ml-2.5 text-white">
                <span className="text-gray-500 font-semibold">
                  Aug 15, 2024
                </span>
                <span className="text-gray-200 pt-2 text-4xl font-extrabold">
                  {item.title}
                </span>
                <div className="flex mt-4">
                  <span className="text-blue-500 font-bold">
                    @{item.author}
                  </span>
                </div>
                <div className="mt-2 ">{item.content}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex mx-auto justify-center">
          <h1>No data found</h1>
        </div>
      )}
    </>
  );
}
