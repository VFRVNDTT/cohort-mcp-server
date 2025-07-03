"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const config_1 = require("./config");
const models_1 = require("./models");
const zod_1 = require("zod");
const fs_1 = require("fs");
const ToolCallSchema = zod_1.z.object({
    tool: zod_1.z.string(),
    query: zod_1.z.string()
});
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
function createToolHandler(toolName, config) {
    return async (args) => {
        const { query } = args;
        debugLog(`Tool '${toolName}' called with query: ${query}`);
        try {
            const currentToolConfig = config.tools[toolName];
            if (!currentToolConfig) {
                throw new Error(`Configuration for tool '${toolName}' not found.`);
            }
            const modelConfig = config.models[currentToolConfig.model];
            if (!modelConfig) {
                throw new Error(`Model '${currentToolConfig.model}' for tool '${toolName}' not found.`);
            }
            let conversation = [
                { role: "system", content: (0, models_1.buildToolPrompt)(currentToolConfig, config.tools) },
                { role: "user", content: query }
            ];
            let finalResponse = "";
            let maxIterations = 5;
            while (maxIterations-- > 0) {
                const modelResponse = await (0, models_1.executeModel)(modelConfig, conversation.map(m => `${m.role}: ${m.content}`).join("\n\n"));
                debugLog(`Model response: ${modelResponse.substring(0, 200)}...`);
                try {
                    const toolCall = ToolCallSchema.parse(JSON.parse(modelResponse));
                    const subToolConfig = config.tools[toolCall.tool];
                    if (!subToolConfig)
                        throw new Error(`Sub-tool '${toolCall.tool}' not found`);
                    const subToolModelConfig = config.models[subToolConfig.model];
                    if (!subToolModelConfig)
                        throw new Error(`Model for sub-tool '${toolCall.tool}' not found`);
                    const toolResponse = await (0, models_1.executeModel)(subToolModelConfig, `${subToolConfig.prompt}\n\n${toolCall.query}`);
                    conversation.push({ role: "assistant", content: modelResponse }, { role: "user", content: `Tool result for '${toolCall.tool}': ${toolResponse}` });
                }
                catch (e) {
                    finalResponse = modelResponse;
                    break;
                }
            }
            if (!finalResponse) {
                throw new Error("Max tool call iterations reached");
            }
            return { content: [{ type: "text", text: finalResponse }] };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
        }
    };
}
async function startServer() {
    debugLog("Server initializing...");
    const server = new mcp_js_1.McpServer({
        name: "cohort",
        version: "0.1.0"
    });
    try {
        const config = (0, config_1.loadConfig)((0, config_1.getConfigPath)());
        for (const toolName in config.tools) {
            const toolConfig = config.tools[toolName];
            debugLog(`Registering tool: ${toolName} with description: ${toolConfig.description}`);
            server.tool(toolName, { query: zod_1.z.string().describe(toolConfig.description) }, createToolHandler(toolName, config));
            debugLog(`Successfully registered tool: ${toolName}`);
        }
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        debugLog("Connection established, running on stdio");
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        debugLog(`Failed to start server: ${message}`);
        process.exit(1);
    }
}
