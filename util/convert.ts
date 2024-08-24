import fs from 'fs';

interface InputModel {
  name: string;
  type: string;
  premium?: boolean;
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
}

interface OutputList {
  object: string;
  data: OutputModel[];
}

function convertToOutputFormat(input: InputProvider[]): OutputList {
  const output: OutputList = {
    object: "list",
    data: []
  };

  let modelId = 0;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  input.forEach(provider => {
    provider.models.forEach(model => {
      output.data.push({
        id: `${modelId}`,
        object: model.type === "llm" ? "chat.completions",
        description: model.description,
        image: model.image,
        created: currentTimestamp,
        owned_by: provider.provider
      });
      modelId++;
    });
  });

  return output;
}


function readJsonFile(filePath: string): InputProvider[] {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
    return [];
  }
}

// Main execution
const filePath = '../models.json';
const inputData = readJsonFile(filePath);
const outputData = convertToOutputFormat(inputData);


fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));

console.log('Conversion complete. Output written to output.json');