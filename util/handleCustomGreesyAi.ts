import axios from "axios";
import "dotenv/config";
import fs from "fs";
import HttpsProxyAgent from "https-proxy-agent";

interface ReqBody {
  model: string;
  messages: Array<any>;
  top_p?: number;
  top_k?: number;
  stream?: boolean;
  frequency_penalty?: number;
  logit_bias?: number | null;
  stop?: string;
  seed?: number;
}


function getRandomProviderOneKey() {
  const keys = [
    process.env.providerone_key,
    process.env.providerone_key_2,
  ];
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

function parseProxyString(proxyString: string) {
  const [host, port, username, password] = proxyString.split(":");
  return { host, port, username, password };
}

function getRandomProxy() {
  const proxies = fs.readFileSync("proxy.txt", "utf-8").split("\n");
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex].trim();
}

async function handleSearchAndGPT(model: string,query: string): Promise<{ summary: string; markdown: string }> {
  
  const googleResults = await axios.get("https://www.googleapis.com/customsearch/v1", {
    params: {
      key: process.env.GOOGLE_API_KEY,
      cx: "364f7ffcea56a4c2a",
      q: query,
    },
  });

  const items = googleResults?.data?.items || [];
  

  const resultsText = items.map((item: any, index: number) => {
    return `${index + 1}. Title: ${item.title}\n   Link: ${item.link}\n   Snippet: ${item.snippet}`;
  }).join("\n\n");

  const gptPrompt = `
You can summarizing web search results when users stars his prompt with 'search', 'search on web' and 'on web'.Summarize web search results concisely if the user's prompt starts with "search," "search on web," or "on web."

Do not use web searches or provide search results if the prompt starts with casual greetings like "hi," "how are you," etc., or any other type of query.
Do not use web searches for simple questions or somethings you know it isnt for searching.
Only use Search results when user starts his prompt with those words "web search", "use search","search on google".

User Query: "${query}"

Search Results:
${resultsText}

Provide a concise summary of the above results.
  `;
  

  const gptResponse = await axios.post(
    process.env.providertwo_url + "v1/chat/completions",
    {
      model: model,
      messages: [{ role: "user", content: gptPrompt }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.providertwo_key}`,
      },
    }
  );

  const summary = gptResponse.data.choices[0]?.message?.content || "Error generating summary.";
  const markdownResults = items.map((item: any, index: number) => {
    return `${index + 1}. [${item.title}](${item.link})`;
  }).join("\n");

  return gptResponse.data;
}


export async function handleCustomGreesyAi(body: ReqBody) {
  const providers = [
    process.env.providerone,
    process.env.providertwo,
    process.env.providerthird,
  ];


  
console.log(body)
  let lastError: Error | null = null;
  if (body.model.endsWith("-online")) {
    body.model = body.model.replace("-online", "").trim();
  
    const userMessage = body.messages.find((msg) => msg.role === "user")?.content;
    if (!userMessage) throw new Error("No user message found.");
    const query = userMessage.replace("search ", "").trim();
    const ds = await handleSearchAndGPT(body.model,query);
    return ds;
  }

  for (const provider of providers) {
    try {
      if (!body || Object.keys(body).length === 0) {
        throw new Error("Invalid or empty body provided.");
      }

      switch (provider) {
        case process.env.providerone:
          return await fetchProvider1(body);
        case process.env.providertwo:
          return await fetchProvider2(body);
        case process.env.providerthird:
          return await fetchProvider3(body);
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      lastError = error as Error;

      console.error(`Error with ${provider}:`, error);
    }
  }

  if (lastError) {
    throw lastError;
  }
}


//.
async function fetchProvider1(body: ReqBody) {
  const keys = [
    process.env.providerone_key,
    process.env.providerone_key_2,
  ];
  console.log(body.stream)
  const randomIndex = Math.floor(Math.random() * keys.length);
  const response = await axios.post(
    process.env.providerone_url + "v1/chat/completions",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keys[randomIndex]}`,
      },
    }
  );
  return response.data;
}

async function fetchProvider2(body: ReqBody) {
  const response = await axios.post(
    process.env.providertwo_url + "v1/chat/completions",
    {
      stream: body.stream,
      model: body.model,
      messages: body.messages,
    },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.providertwo_key}`,
      },
    }
  );
  return response.data;
}

async function fetchProvider3(body: ReqBody) {
  const randomProxy = getRandomProxy();
  const { host, port, username, password } = parseProxyString(randomProxy);
  const agent = new HttpsProxyAgent({
    host,
    port: parseInt(port),
    auth: `${username}:${password}`,
  });

  const response = await axios.post(
    process.env.providerthird_url + "v1/chat/completions",
    {
      model: body.model,
      messages: body.messages,
    },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.providerthird_key}`,
      },
      httpsAgent: agent,
    }
  );
  return response.data;
}
