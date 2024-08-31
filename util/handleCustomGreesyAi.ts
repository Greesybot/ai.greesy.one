import axios from 'axios';
import 'dotenv/config'

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

export async function handleCustomGreesyAi(body: ReqBody) {
  const providers = [
    process.env.providerone,
    process.env.providertwo,
    process.env.providerthird,
  ];
  
  let lastError: Error | null = null;

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

function getRandomProviderOneKey() {
  const keys = [
    process.env.providerone_key_1,
    process.env.providerone_key_2,
    process.env.providerone_key_3,
    process.env.providerone_key_4,
    process.env.providerone_key_5
  ];
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

async function fetchProvider1(body: ReqBody) {
  try {
    if (!body) {
      throw new Error("No body provided to fetchProvider1.");
    }
   
    const randomKey = getRandomProviderOneKey();
    
    const response = await axios.post(
      process.env.providerone_url + 'v1/chat/completions',
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${randomKey}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response not OK:', error.response);
      throw new Error(`Provider 1 request failed: ${error.response.statusText}. Response: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Error with the request:', (error as Error).message);
      throw error;
    }
  }
}

async function fetchProvider2(body: ReqBody) {
  try {
    const response = await axios.post("https://api.provider2.com/endpoint", {
      model: body.model,
      messages: body.messages
    }, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Provider 2 request failed: ${error.response.statusText}. Response: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

async function fetchProvider3(body: ReqBody) {
  try {
    const response = await axios.post("https://api.provider3.com/endpoint", body, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Provider 3 request failed: ${error.response.statusText}. Response: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}