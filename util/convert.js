"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function convertToOutputFormat(input) {
    var output = {
        object: "list",
        data: [],
    };
    var currentTimestamp = Math.floor(Date.now() / 1000);
    input.forEach(function (provider) {
        provider.models.forEach(function (model) {
            var _a;
            var existingModel = output.data.find(function (m) { return m.id === model.name; });
            if (existingModel) {
                if (!existingModel.providers.includes(provider.provider)) {
                    existingModel.providers.push(provider.provider);
                }
            }
            else {
                output.data.push({
                    id: model.name,
                    object: model.type === "llm" ? "chat.completions" : model.type,
                    description: model.description,
                    image: model.image,
                    created: currentTimestamp,
                    owned_by: model.name.split("/")[0],
                    providers: [provider.provider],
                    premium: (_a = model.premium) !== null && _a !== void 0 ? _a : false,
                });
            }
        });
    });
    return output;
}
function readJsonFile(filePath) {
    try {
        var jsonData = fs_1.default.readFileSync(filePath, "utf-8");
        return JSON.parse(jsonData);
    }
    catch (error) {
        console.error("Error reading or parsing the JSON file:", error);
        return [];
    }
}
var filePath = "./models.json";
var inputData = readJsonFile(filePath);
var outputData = convertToOutputFormat(inputData);
fs_1.default.writeFileSync("data/output.json", JSON.stringify(outputData, null, 2));
console.log("Conversion complete. Output written to output.json");
