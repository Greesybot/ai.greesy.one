"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Nav from "../../components/Main/Nav";

interface BlogData {
  title: string;
  author: string;
  content: string;
  // Add other properties as needed
}

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

interface BlogParams {
  id: string;
}

const CustomCodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  let language = match ? match[1] : 'text';
  
  const codeContent = (children[0] || '').toString().split();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (inline) {
    return <code className={className}>{codeContent}</code>;
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="language">{language}</span>
        <button className="copy-button" onClick={copyToClipboard}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};



  

export default function Blog({ params }: { params: BlogParams }) {
  const router = useRouter();
  const [data, setData] = useState<BlogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/blogs/get?id=${params.id}`);
        const result = await response.json();
        if (result.length === 0) {
          router.push("/404");
        } else {
          setLoading(false);
          setData(result[0]);
          setStatus(response.status);
        }
      } catch (error) {
        setStatus(500);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex mx-auto justify-center h-screen w-full">
        <Skeleton height={20} width={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex mx-auto justify-center">
        <h1>Error: {error}</h1>
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
      <div className="flex z-0 justify-between px-6 py-4 flex-col h-screen bg-black w-full">
        <div className="flex flex-col space-y-4 isolate">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-200 font-bold font-sans "
          >
            <span className="text-gray-500 -ml-4">
              <MdKeyboardArrowLeft />
            </span>
            Go Back
          </button>
          <div className={`flex flex-col space-y-4 pt-12 -ml-2.5 mt-2 text-white `}>
            <span className="text-gray-500 font-semibold">Aug 15, 2024</span>
            <span className="text-gray-200 text-6xl break-all font-sans font-extrabold">
              {data.title}
            </span>
            <div className="flex">
              <span className="text-blue-500 font-bold">@{data.author}</span>
            </div>
            <div className="mt-2"><Markdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    img: ({ node, ...props }) => (
      <div className="relative w-full h-64">
        <Image
          {...props}
          layout="fill"
          objectFit="cover"
          alt={props.alt || ""}
          loading="lazy"
        />
      </div>
    ),
    code: CustomCodeBlock,
    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-md font-bold mt-5 mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-md text-gray-400 font-semibold mt-4 mb-2" {...props} />,
    h4: ({node, ...props}) => <h3 className="text-sm text-gray-400 font-semibold mt-4 mb-2" {...props} />,
    h5: ({node, ...props}) => <h3 className="text-xl text-gray-400 font-semibold mt-4 mb-2" {...props} />,
    // Add more heading styles as needed
  }}
>
  {data.content}
</Markdown>


            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .code-block {
          background-color: #1e1e1e;
          border-radius: 8px;
          overflow: hidden;
          font-family: monospace;
          margin: 20px 0;
        }
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: #2d2d2d;
          color: #e0e0e0;
        }
        .language {
          font-size: 14px;
        }
        .copy-button {
          background: none;
          border: none;
          color: #e0e0e0;
          cursor: pointer;
          font-size: 14px;
        }
        .code-block pre {
          margin: 0;
          padding: 12px;
          overflow-x: auto;
        }
        .code-block code {
          color: #e0e0e0;
        }
      `}</style>
    </>
  );
}
