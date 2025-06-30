"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeModel = executeModel;
exports.buildToolPrompt = buildToolPrompt;
const child_process_1 = require("child_process");
function resolveApiKey(apiKey) {
    if (apiKey.startsWith("env:")) {
        const envVar = apiKey.substring(4);
        const key = process.env[envVar];
        if (!key) {
            throw new Error(`Environment variable not found: ${envVar}`);
        }
        return key;
    }
    return apiKey;
}
async function executeModel(modelConfig, prompt) {
    switch (modelConfig.provider) {
        case "cli":
            return executeCliModel(modelConfig.command, prompt);
        case "google":
            return executeGoogleModel(resolveApiKey(modelConfig.apiKey), prompt);
        case "anthropic":
            return executeAnthropicModel(resolveApiKey(modelConfig.apiKey), prompt);
        case "ollama":
            return executeOllamaModel(modelConfig.baseURL, modelConfig.model, prompt);
        default:
            throw new Error(`Unsupported provider: ${modelConfig.provider}`);
    }
}
async function executeCliModel(command, prompt) {
    return new Promise((resolve, reject) => {
        // Split command into parts for spawn
        const [cmd, ...args] = command.split(" ");
        const child = (0, child_process_1.spawn)(cmd, [...args, prompt], {
            stdio: ["pipe", "pipe", "pipe"]
        });
        let stdout = "";
        let stderr = "";
        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        child.on("error", (error) => {
            reject(`CLI execution error: ${error.message}`);
        });
        child.on("close", (code) => {
            if (code !== 0) {
                reject(`CLI process exited with code ${code}: ${stderr}`);
            }
            else {
                resolve(stdout.trim());
            }
        });
    });
}
async function executeGoogleModel(apiKey, prompt) {
    // Placeholder for Google API implementation
    return `Google API response to: ${prompt.substring(0, 50)}...`;
}
async function executeAnthropicModel(apiKey, prompt) {
    // Placeholder for Anthropic API implementation
    return `Anthropic API response to: ${prompt.substring(0, 50)}...`;
}
async function executeOllamaModel(baseURL, model, prompt) {
    // Placeholder for Ollama API implementation
    return `Ollama (${model}) response to: ${prompt.substring(0, 50)}...`;
}
// Builds the system prompt for a tool by combining the tool's prompt with tool-calling instructions
function buildToolPrompt(toolConfig, availableTools) {
    const toolList = Object.entries(availableTools)
        .map(([name, config]) => `- ${name}: ${config.description}`)
        .join("\n");
    return `${toolConfig.prompt}

When you need to use another tool to complete a task, output a JSON object in the following format:
{
  "tool": "tool_name",
  "query": "detailed query for the tool"
}

Available tools:
${toolList}

Your response must be either:
1. Directly answering the user's request, or
2. A JSON object calling another tool.

Do not include any other text besides the JSON object when calling a tool.`;
}
