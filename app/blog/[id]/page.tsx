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
  date: string; // Added date field
}

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
}

interface BlogParams {
  id: string;
}

const CustomCodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  const codeContent = Array.isArray(children)
    ? children.join("")
    : children?.toString() || "";
  const lines = codeContent.split("\n");

  const copyToClipboard = async () => {
    const codeContent = Array.isArray(children)
      ? children.join("")
      : children?.toString() || "";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern browsers with secure context
        await navigator.clipboard.writeText(codeContent);
        setCopied(true);
      } else {
        // Fallback for older browsers or non-HTTPS environments
        const textArea = document.createElement("textarea");
        textArea.value = codeContent;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopied(false);
    }
  };
  if (inline) {
    return <code className={className}>{JSON.stringify(codeContent)}</code>;
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="language">{language}</span>
        <button className="copy-button" onClick={copyToClipboard}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="code-content">
        <pre className={className}>
          <div>
            {lines.map((line, index) => (
              <div key={index} className="code-line">
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </div>
        </pre>
      </div>
    </div>
  );
};

export default function Blog({ params }: { params: BlogParams }) {
  const router = useRouter();
  const [data, setData] = useState<BlogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/blogs/get?id=${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.length === 0) {
          router.push("/404");
        } else {
          setData(result[0]);
        }
      } catch (error) {
        router.push("/404");
        setError("Failed to fetch data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  useEffect(() => {
    const messages = [
      "Minelya's one of best project is GreesyAI",
      "GreesyAI have its own ai models",
      "Greesy is best friend of DisCore",
      "AI is Future of Our Era",
      "GreesyAI's purpose is give access to AI Models",
    ];
    setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen  text-white">
        <div className="w-16 h-16 mb-4 relative">
          <Image
            src="/favicon.ico"
            alt="Discord Logo"
            width={64}
            height={64}
            className="animate-pulse"
          />
        </div>
        <h2 className="text-lg font-semibold mb-2">DID YOU KNOW</h2>
        <p className="text-sm text-center max-w-xs">{loadingMessage}</p>
      </div>
    );

  if (error) {
    return (
      <div className="flex mx-auto justify-center">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  if (!data) {
    return router.push("/404");
  }

  return (
    <>
      <Nav />
      <div className="flex z-0 justify-between px-6 py-4 flex-col min-h-screen w-full">
        <div className="flex flex-col space-y-4 isolate">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-200 font-bold font-sans"
          >
            <span className="text-gray-500 -ml-4">
              <MdKeyboardArrowLeft />
            </span>
            Go Back
          </button>
          <div className="flex flex-col space-y-4 pt-12 -ml-2.5 mt-2 text-white">
            <span className="text-gray-500 font-semibold">{data.date}</span>
            <h1 className="text-gray-200 text-6xl break-words font-sans font-extrabold">
              {data.title}
            </h1>
            <div className="flex">
              <span className="text-blue-500 font-bold">@{data.author}</span>
            </div>
            <div className="mt-2">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  img: ({ node, ...props }) => (
                    <div className="relative w-full h-64 rounded-2xl flex border border-none">
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
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg text-gray-300 font-semibold mt-4 mb-2"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-base text-gray-400 font-semibold mt-4 mb-2"
                      {...props}
                    />
                  ),
                  h5: ({ node, ...props }) => (
                    <h5
                      className="text-sm text-gray-500 font-semibold mt-4 mb-2"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table
                        className="table-auto border-collapse my-4 w-full"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gray-800" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-gray-600 px-4 py-2 text-left"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="border border-gray-700 px-4 py-2"
                      {...props}
                    />
                  ),
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
          font-family: "Fira Code", monospace;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background-color: #2d2d2d;
          color: #e0e0e0;
          font-size: 14px;
        }
        .language {
          font-weight: bold;
          color: #bb86fc;
        }
        .copy-button {
          background: none;
          border: 1px solid #bb86fc;
          color: #bb86fc;
          cursor: pointer;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .copy-button:hover {
          background-color: #bb86fc;
          color: #1e1e1e;
        }
        .code-content {
          max-height: 400px;
          overflow-y: auto;
        }
        .code-block pre {
          margin: 0;
          padding: 12px 0;
        }
        .code-block code {
          color: #e0e0e0;
          display: block;
        }
        .code-line {
          display: flex;
          padding: 0 12px;
        }
        .code-line:hover {
          background-color: #2d2d2d;
        }
        .line-number {
          color: #6c6c6c;
          text-align: right;
          user-select: none;
          padding-right: 12px;
          min-width: 40px;
        }
        .line-content {
          padding-left: 12px;
          border-left: 1px solid #3d3d3d;
        }
        .overflow-x-auto {
          overflow-x: auto;
        }
        .table-auto {
          border-collapse: collapse;
          width: 100%;
        }
        .table-auto th,
        .table-auto td {
          border: 1px solid #4a4a4a;
          padding: 8px 12px;
        }
        .table-auto thead {
          background-color: #2d2d2d;
        }
        .table-auto th {
          font-weight: bold;
          text-align: left;
        }
        .table-auto tr:nth-child(even) {
          background-color: #1a1a1a;
        }
      `}</style>
    </>
  );
}
