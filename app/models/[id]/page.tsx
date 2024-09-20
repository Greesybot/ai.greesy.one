"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Models from "../../components/Models/Card";
import Nav from "../../components/Main/Nav";
import { useRouter } from "next/navigation";

interface Mparams {
  id: string[];
}

export default function Home({ params }: { params: Mparams }) {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/v1/models");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();

        // Combine id parts like "openai/o1"
        const fullModelId = params.id.join("/");
        console.log(fullModelId);
        const model = data.find((x: any) => x.name === fullModelId);
        if (model) {
          setModels([model]);
        } else {
          router.push("/404");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels();
  }, [params.id, router]);

  useEffect(() => {
    const messages = [
      "Kurdistan is Real",
      "GreesyAI has its own AI models",
      "Greesy is the best friend of DisCore",
      "AI is the Future of Our Era",
      "GreesyAI's purpose is to give access to AI Models",
    ];
    setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
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
      {models.length > 0 ? (
        <Models model={models[0]} />
      ) : (
        <div>No models found</div>
      )}
    </>
  );
}
