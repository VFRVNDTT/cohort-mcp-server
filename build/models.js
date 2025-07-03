"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeModel = executeModel;
exports.buildToolPrompt = buildToolPrompt;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
function debugLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    try {
        (0, fs_1.appendFileSync)("debug.log", logMessage);
    }
    catch (e) {
        // Silently fail if debug logging isn't available
    }
}
async function executeModel(modelConfig, prompt) {
    switch (modelConfig.provider) {
        case "cli":
            return executeCliModel(modelConfig.command, prompt);
        default:
            throw new Error(`Unsupported provider: ${modelConfig.provider}. Only 'cli' provider is currently implemented.`);
    }
}
function escapeShellArg(arg) {
    // Escape single quotes by ending the quoted string, adding an escaped quote, and starting a new quoted string
    return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
}
async function executeCliModel(command, prompt) {
    return new Promise((resolve, reject) => {
        // Split command into parts for spawn
        const [cmd, ...baseArgs] = command.split(" ");
        // Add the prompt as a properly escaped argument
        const args = [...baseArgs, escapeShellArg(prompt)];
        debugLog(`Executing: ${cmd} ${args.join(" ")} with prompt: ${prompt.substring(0, 100)}...`);
        const child = (0, child_process_1.spawn)(cmd, args, {
            stdio: ["pipe", "pipe", "pipe"],
            shell: true // Enable shell to handle argument parsing properly
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
            debugLog(`CLI process exited with code: ${code}`);
            debugLog(`stdout: ${stdout}`);
            debugLog(`stderr: ${stderr}`);
            if (code !== 0) {
                reject(`CLI process exited with code ${code}: ${stderr}`);
            }
            else {
                resolve(stdout.trim());
            }
        });
        // Close stdin immediately since we're not using it
        child.stdin.end();
    });
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
