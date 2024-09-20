import fs from "fs";

interface InputModel {
  name: string;
  type: string;
  premium?: boolean;
  description?: string;
  image?: string;
}

interface InputProvider {
  provider: string;
  models: InputModel[];
}

interface OutputModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  providers: string[];
  premium: boolean;
  description?: string;
  image?: string;
}

interface OutputList {
  object: string;
  data: OutputModel[];
}

function convertToOutputFormat(input: InputProvider[]): OutputList {
  const output: OutputList = {
    object: "list",
    data: [],
  };

  const currentTimestamp = Math.floor(Date.now() / 1000);

  input.forEach((provider) => {
    provider.models.forEach((model) => {
      const existingModel = output.data.find((m) => m.id === model.name);

      if (existingModel) {
        if (!existingModel.providers.includes(provider.provider)) {
          existingModel.providers.push(provider.provider);
        }
      } else {
        output.data.push({
          id: model.name,
          object: model.type === "llm" ? "chat.completions" : model.type,
          description: model.description,
          image: model.image,
          created: currentTimestamp,
          owned_by: model.name.split("/")[0],
          providers: [provider.provider],
          premium: model.premium ?? false,
        });
      }
    });
  });

  return output;
}

function readJsonFile(filePath: string): InputProvider[] {
  try {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading or parsing the JSON file:", error);
    return [];
  }
}

const filePath = "./models.json";
const inputData = readJsonFile(filePath);
const outputData = convertToOutputFormat(inputData);

fs.writeFileSync("data/output.json", JSON.stringify(outputData, null, 2));

console.log("Conversion complete. Output written to output.json");
