import { z } from "zod";
import fs from "fs";
import path from "path";

// Define Zod schemas for configuration validation
const ModelConfigSchema = z.union([
  z.object({
    provider: z.literal("cli"),
    command: z.string().describe("Command to execute the CLI model")
  }),
  z.object({
    provider: z.literal("google"),
    apiKey: z.string().describe("Google API key (can use 'env:VAR_NAME' syntax)")
  }),
  z.object({
    provider: z.literal("anthropic"),
    apiKey: z.string().describe("Anthropic API key (can use 'env:VAR_NAME' syntax)")
  }),
  z.object({
    provider: z.literal("ollama"),
    baseURL: z.string().url().describe("Base URL for Ollama API"),
    model: z.string().describe("Model name to use with Ollama")
  })
]);

const ToolConfigSchema = z.object({
  model: z.string().describe("Model ID to use for this tool"),
  description: z.string().describe("Description of the tool's purpose"),
  prompt: z.string().describe("System prompt to use with this tool")
});

const ConfigSchema = z.object({
  mainModel: z.string().describe("Default model ID for general tasks"),
  models: z.record(z.string(), ModelConfigSchema),
  tools: z.record(z.string(), ToolConfigSchema)
});

export type Config = z.infer<typeof ConfigSchema>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export type ToolConfig = z.infer<typeof ToolConfigSchema>;

// Load configuration from file
export function loadConfig(configPath: string): Config {
  try {
    const rawConfig = fs.readFileSync(configPath, "utf8");
    const jsonConfig = JSON.parse(rawConfig);
    return ConfigSchema.parse(jsonConfig);
  } catch (error) {
    throw new Error(`Failed to load config: ${error instanceof Error ? error.message : error}`);
  }
}

// Get the config path
export function getConfigPath(): string {
  // 1. From environment variable
  if (process.env.COHORT_CONFIG_PATH) {
    return process.env.COHORT_CONFIG_PATH;
  }

  // 2. From current working directory
  const localConfig = path.join(process.cwd(), "cohort.config.json");
  if (fs.existsSync(localConfig)) {
    return localConfig;
  }

  // 3. Bundled template as a fallback
  return path.join(__dirname, "../../templates/cohort.config.json");
}