"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Minus, Sun, Moon } from "lucide-react";
import Nav from "../components/Main/Nav";

type ModelData = {
  rank: number;
  name: string;
  score: number;
  arenaScore: number;
  organization: string;
  license: string;
  trend: "up" | "down" | "neutral";
};

const modelData: ModelData[] = [
  {
    rank: 1,
    name: "GPT-4",
    score: 95.8,
    arenaScore: 98.2,
    organization: "OpenAI",
    license: "Proprietary",
    trend: "up",
  },
  {
    rank: 2,
    name: "Claude 3.5",
    score: 93.2,
    arenaScore: 95.7,
    organization: "Anthropic",
    license: "Proprietary",
    trend: "up",
  },
  {
    rank: 3,
    name: "Greesychat Turbo",
    score: 92.5,
    arenaScore: 94.1,
    organization: "GreesyAI",
    license: "Proprietary",
    trend: "neutral",
  },
  {
    rank: 4,
    name: "LLaMA 3",
    score: 91.7,
    arenaScore: 93.5,
    organization: "Meta",
    license: "Llama",
    trend: "up",
  },
  {
    rank: 5,
    name: "BLOOM",
    score: 89.3,
    arenaScore: 90.8,
    organization: "BigScience",
    license: "OpenRAIL-M v1",
    trend: "down",
  },
  {
    rank: 6,
    name: "Jurassic-1",
    score: 88.9,
    arenaScore: 89.6,
    organization: "AI21 Labs",
    license: "Proprietary",
    trend: "neutral",
  },
  {
    rank: 7,
    name: "GPT-3",
    score: 88.5,
    arenaScore: 89.2,
    organization: "OpenAI",
    license: "Proprietary",
    trend: "down",
  },
  {
    rank: 8,
    name: "BERT",
    score: 86.2,
    arenaScore: 87.5,
    organization: "Google",
    license: "Apache 2.0",
    trend: "down",
  },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
  switch (trend) {
    case "up":
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    case "neutral":
      return <Minus className="w-4 h-4 text-gray-300" />;
  }
};

export default function Component() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-transparent transition-colors duration-300">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-100">
              LLM Model Leaderboard
            </h1>
          </div>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full bg-black border-collapse transition-colors duration-300">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Performance Score
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300  uppercase tracking-wider">
                    Arena Score
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300  uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300  uppercase tracking-wider">
                    License
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300  uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {modelData.map((model) => (
                  <tr
                    key={model.rank}
                    className="hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-100">
                      {model.rank}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-100">
                      {model.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300 ">
                      <span className="bg-blue-900 text-blue-200 py-1 px-2 rounded-full text-xs font-medium">
                        {model.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300 ">
                      <span className="bg-green-900 text-green-200 py-1 px-2 rounded-full text-xs font-medium">
                        {model.arenaScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300 ">
                      {model.organization}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300 ">
                      {model.license}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300 ">
                      <TrendIcon trend={model.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
