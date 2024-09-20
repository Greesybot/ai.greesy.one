"use client";
import React, { useState, useRef, useEffect } from "react";
import MSelect from "./Select";
import Nav from "../Main/Nav";
import { LuSettings2 } from "react-icons/lu";
import { MdRuleFolder } from "react-icons/md";
import { RiAttachmentLine } from "react-icons/ri";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import Alert from "../Main/Alert";
const models = [
  "greesyai/greesychat-turbo",
  "deepseek/deepseek-chat",
  "openai/gpt4o",
  "openai/o1-preview",
  "deepseek/deepseek-coder",
  "anthropic/claude-3.5-sonnet",
  "perplexity/llama-3.1-sonar-small-128k-chat",
];

const pr = ["gpt-3.5-turbo", "gpt-4", "gpt-4o-mini", "gpt-4o", "gpt-4-turbo"];

function App(showSelect?:boolean, selected?: string) {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState(selected ?? models[0]);
  const [selectedPreset, setSelectedPreset] = useState(pr[0]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
  };

  const handleUserInput = (e) => {
    setInputValue(e.target.value);
  };

  const processMarkdown = async (text) => {
    const processed = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        transformers: [
          transformerCopyButton({
            visibility: "always",
            feedbackDuration: 3000,
          }),
        ],
      })
      .use(remarkHtml, { sanitize: true })
      .process(text);

    return processed.toString();
  };

  const handleSendButton = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: inputValue },
    ]);

    setInputValue("");

    try {
      const response = await fetch(`/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer userkey",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            ...chatHistory.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: inputValue },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const processedContent = await processMarkdown(
        data.choices[0].message.content,
      );

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "assistant",
          content: processedContent,
        },
      ]);
    } catch (error) {
      console.error("There was an error sending the message:", error);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "assistant",
          content:
            "I'm sorry, there was an error processing your request. Please try again.",
        },
      ]);
      return <Alert message={error.message} />;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="h-screen flex flex-col bg-black text-[#dcddde]">
      <Nav />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Model selection */}
        <div className="flex items-center space-x-2 p-4 border-b border-gray-900">
          <MSelect
            size="w-64"
            disabled={showSelect}
            options={models}
            selectedOption={selectedModel}
            onChange={handleModelChange}
          />
          <button className="p-2 border rounded-md bg-gradient-to-bl from-blue-500 to-purple-800 border-transparent">
            <LuSettings2 size="20px" className="text-[#e7e8ea]" />
          </button>
          <button className="p-2 h-10 border rounded-md bg-gradient-to-bl from-blue-500 to-purple-800 border-transparent">
            <MdRuleFolder size="20px" className="text-[#e7e8ea]" />
          </button>
        </div>

        {/* Chat area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatHistory.length > 0 ? (
            chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-[#2c2f33]" : "bg-[#23272a]"
                  }`}
                >
                  <div className="font-bold mb-1 text-[#ffffff]">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div
                    className="break-all"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            ))
          ) : (
            <h1 className="font-bold text-center text-md mt-24 bottom-2">
              How can I help you?
            </h1>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-lg p-3 bg-[#23272a]">
                <div className="font-bold mb-1 text-[#ffffff]">AI</div>
                <div>Thinking...</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-800">
        <div className="flex items-center bg-[#2c2f33] rounded-lg p-2">
          <button className="mr-2 hover:bg-gray-700 p-1 rounded">
            <RiAttachmentLine size="20px" className="text-[#e7e8ea]" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleUserInput}
            onKeyPress={(e) => e.key === "Enter" && handleSendButton()}
            placeholder="Message AI"
            className="flex-1 text-[#dcddde] placeholder-[#72767d] bg-transparent outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendButton}
            className={`ml-2 w-8 h-8 text-white rounded-full flex items-center justify-center ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-bl from-blue-500 to-purple-800  hover:bg-[#4752c4]"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "..." : "↑"}
          </button>
        </div>
        <div className="flex justify-center mt-4 text-sm text-[#72767d] space-x-4">
          <a href="#" className="hover:underline">
            GreesyAI v0.5-beta
          </a>
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
          <a href="#" className="hover:underline">
            Terms of service
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
