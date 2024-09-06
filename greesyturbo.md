# API Documentation for Greesychat Turbo AI Model

## Overview

The Greesychat Turbo AI model provides high-quality text generation capabilities using an OpenAI-compatible API. Below, you'll find details on how to interact with the model using various SDKs and view benchmark results.

## Base URL

```
https://ai.greesy.one/api/v1
```

## Authentication

Use the following header for authentication:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Text Generation

#### Request

- **Endpoint:** `/chat/completions`
- **Method:** POST
- **Content-Type:** application/json

**Request Body:**

```json
{
  "prompt": "Your input text here",
  "max_tokens": 100,
  "temperature": 0.7,
  "top_p": 0.9
}
```

#### Response

```json
{
  "id": "chatcmpl-12345678",
  "object": "chat.completions",
  "created": "timestamp",
  "model": "greesyai/greesychat-turbo",
  "choices": [
    {
      "text": "Hello! Nice to meet you",
      "index": 0
    }
  ]
}
```

### Example Usage

#### Python SDK

Install the OpenAI Python SDK:

```bash
pip install openai
```

Example code to generate text:

```python
import openai

openai.api_key = "YOUR_API_KEY"

response = openai.chat.Completion.create(
  engine="greesyai/greesychat-turbo",
  prompt="Your input text here",
  max_tokens=100,
  temperature=0.7,
  top_p=0.9
)

print(response.choices[0].text.strip())
```

#### JavaScript SDK

Install the OpenAI JavaScript SDK:

```bash
npm install openai
```

Example code to generate text:

```javascript
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: "YOUR_API_KEY" });

(async () => {
  const response = await openai.chat.completions.create({
    model: "greesyai/greesychat-turbo",
    prompt: "Your input text here",
    max_tokens: 100,
    temperature: 0.7,
    top_p: 0.9,
  });

  console.log(response.choices[0].text.trim());
})();
```

## Benchmark Results

| Metric               | Value           |
| -------------------- | --------------- |
| **Perplexity**       | 22.5            |
| **Generation Speed** | 75 ms per token |
| **Accuracy**         | 70%             |
| **Response Time**    | 200 ms          |

| Metric    | Greesychat-turbo | Mixtral-8x7b | GPT-4 |
| --------- | ---------------- | ------------ | ----- |
| **Code**  | 79.2             | 75.6         | 83.6  |
| **MMLU**  | 74.5             | 79.9         | 85.1  |
| **Gms8k** | 89.2 (5)         | 88.7         | 94.2  |

## Error Codes

| Code | Message               | Description                               |
| ---- | --------------------- | ----------------------------------------- |
| 400  | Bad Request           | The request is invalid or missing fields. |
| 401  | Unauthorized          | Invalid API key or authentication error.  |
| 500  | Internal Server Error | Something went wrong on the server side.  |

## Contact

For support or inquiries, please contact: [support@greesy.one](mailto:support@greesy.one)
