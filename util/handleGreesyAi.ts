import { Client } from "@gradio/client";

interface Messages {
  role: "user" | "assistant" | "system";
  content: string;
}

async function convertToOpenAi(messages: Messages[]): Promise<any> {
  const assistantMessage = messages.message.find(msg => msg.role === "assistant");
  
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

async function handleGreesyAi(modelName: string, messages: Messages[]): Promise<any> {
  if (modelName === "greesyai/greesychat-turbo") {
    const app = await Client.connect("OnlyCheeini/Greesy", { hf_token:process.env.HF_TOKEN}});

    const userMessages = messages.filter(msg => msg.role === "user").map(msg => msg.content);
    const aMessages = messages.filter(msg => msg.role === "system").map(msg => msg.content);
    const result = await app.predict("/chat", [
      userMessages.join("\n"), // Combine user messages into a single string for the message input
     aMessages, // The system message
      0, // Temperature
      4096 // Max new tokens
    ]);
   const data = {
     role: "assistant",
     content: result.data.message
   }
    return convertToOpenAi(data)
  }
}

export { convertToOpenAi, handleGreesyAi };