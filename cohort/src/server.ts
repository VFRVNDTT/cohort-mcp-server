import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig, getConfigPath, ModelConfig, ToolConfig, Config } from "./config";
import { executeModel, buildToolPrompt } from "./models";
import { z } from "zod";

// Tool call schema for parsing model output
const ToolCallSchema = z.object({
  tool: z.string(),
  query: z.string()
});

// Create MCP server
const server = new McpServer({
  name: "cohort",
  version: "0.1.0"
});

// Main tool that handles user requests
server.tool(
  "run",
  {
    query: z.string().describe("User's query or task"),
    configPath: z.string().optional().describe("Path to config file")
  },
  async ({ query, configPath }) => {
    try {
      // Load configuration
      const config = loadConfig(configPath || getConfigPath());
      
      // Get main model config
      let mainModelConfig = config.models[config.mainModel];
      if (!mainModelConfig) {
        throw new Error(`Main model '${config.mainModel}' not found in config`);
      }
      
      // Find the tool associated with the main model
      const mainTool = Object.values(config.tools).find(tool =>
        tool.model === config.mainModel
      );

      if (!mainTool) {
        throw new Error(`No tool found for main model '${config.mainModel}'`);
      }

      // Prepare initial prompt
      let conversation = [
        { role: "system", content: buildToolPrompt(mainTool, config.tools) },
        { role: "user", content: query }
      ];
      
      let finalResponse = "";
      let maxIterations = 5; // Prevent infinite loops
      
      while (maxIterations-- > 0) {
        // Execute the model
        const modelResponse = await executeModel(
          mainModelConfig,
          conversation.map(m => `${m.role}: ${m.content}`).join("\n\n")
        );
        
        // Try to parse as tool call
        try {
          const toolCall = ToolCallSchema.parse(JSON.parse(modelResponse));
          
          // Get tool config
          const toolConfig = config.tools[toolCall.tool];
          if (!toolConfig) {
            throw new Error(`Tool '${toolCall.tool}' not found`);
          }
          
          // Get tool model config
          let toolModelConfig = config.models[toolConfig.model];
          if (!toolModelConfig) {
            throw new Error(`Model '${toolConfig.model}' for tool '${toolCall.tool}' not found`);
          }
          
          // Execute tool
          const toolResponse = await executeModel(
            toolModelConfig,
            `${toolConfig.prompt}\n\n${toolCall.query}`
          );
          
          // Add to conversation
          conversation.push(
            { role: "assistant", content: modelResponse },
            { role: "user", content: `Tool result for '${toolCall.tool}': ${toolResponse}` }
          );
        } catch (e) {
          // Not a tool call, return as final response
          finalResponse = modelResponse;
          break;
        }
      }
      
      if (!finalResponse) {
        throw new Error("Max tool call iterations reached");
      }
      
      return {
        content: [
          {
            type: "text",
            text: finalResponse
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : error}`
          }
        ],
        isError: true
      };
    }
  }
);

// Function to start the server
export async function startServer() {
  console.error("Cohort Server: Initializing...");
  const transport = new StdioServerTransport();
  
  try {
    console.error("Cohort Server: Connecting to transport...");
    await server.connect(transport);
    console.error("Cohort Server: Connection established, running on stdio.");
  } catch (err) {
    console.error("Cohort Server: Fatal error during connection:", err);
    process.exit(1);
  }
}