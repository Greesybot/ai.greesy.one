"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Models from "../components/Models/Card";
import Nav from "../components/Main/Nav";

export default function Home() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/v1/models");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels();
  }, []);

  useEffect(() => {
    const messages = [
      "Kurdistan is Real",
      "GreesyAI have its own ai models",
      "Greesy is best friend of DisCore",
      "AI is Future of Our Era",
      "GreesyAI's purpose is give access to AI Models",
    ];
    setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  if (isLoading)
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

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Nav />
      <div className="bg-gradient-to-br from-black via-black to-purple-700/[0.2] text-white p-6 w-full min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Browse GreesyAI Models</h1>

          <p className="mb-6 text-base text-gray-400 leading-tight">
            Click on a model to view more details. All models are hosted by
            GreesyAI and other providers.
          </p>

          <div className="relative mb-6 max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-black border border-gray-800 rounded-full py-2 px-4 pr-12 focus:outline-none text-sm"
            />
            <button className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {models.data && models.data.length > 0 ? (
          <Models models={models.data} searchQuery={search} />
        ) : (
          <p>No models available.</p>
        )}
      </div>
    </>
  );
}
