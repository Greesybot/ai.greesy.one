import { Client } from "@gradio/client";
import {handleCustomGreesyAi} from './handleCustomGreesyAi'
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

async function convertToOpenAi(messages: Message[]): Promise<any> {
  const assistantMessage = messages.find(msg => msg.role === "assistant");

  return {
    id: "chatcmpl-premium",
    object: "chat.completion",
    model: "greesychat-turbo",
    choices: [
      {
        finish_reason: "stop",
        index: 0,
        message: {
          content: assistantMessage ? assistantMessage.content : "",
          role: "assistant"
        },
        logprobs: null
      }
    ],
    usage: {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0
    }
  };
}

async function handleGreesyAi(modelName: string, messages: Message[]): Promise<any> {
  if (modelName === "greesyai/greesychat-turbo") {
    const app = await Client.connect("OnlyCheeini/Greesy", { hf_token: process.env.HF_TOKEN });

    const userMessages = messages.filter(msg => msg.role === "user").map(msg => msg.content).join("\n");
    const systemMessage = messages.find(msg => msg.role === "system")?.content;

    const result = await app.predict("/chat", [
      userMessages, // Combined user messages into a single string for the message input
      systemMessage, // The system message
      0, // Temperature
      4096 // Max new tokens
    ]);

    const data: Message = {
      role: "assistant",
      content: String(result.data) // Assuming the response contains the message directly
    };

    return convertToOpenAi([data]); 
  } else {
    const body = {
      model: modelName.split("/")[1],
      messages: messages
    }
    return await handleCustomGreesyAi(body)
  }
  return null;
}

export { convertToOpenAi, handleGreesyAi };