import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";
import { EventEmitter } from "events";

// Define Zod schemas for configuration validation
const CliModelConfigSchema = z.object({
  provider: z.literal("cli"),
  command: z.string().describe("Command to execute the CLI model")
});

const ApiModelConfigSchema = z.object({
  provider: z.enum(["google", "anthropic", "openai", "ollama", "openrouter"]),
  apiKey: z.string().describe("API key for the model provider (can use env: prefix)"),
  model: z.string().describe("Model name/identifier"),
  baseUrl: z.string().optional().describe("Base URL for the API (for custom endpoints)")
});

const ModelConfigSchema = z.union([CliModelConfigSchema, ApiModelConfigSchema]);

const ToolConfigSchema = z.object({
  model: z.string().describe("Primary model ID to use for this tool"),
  fallbackModels: z.array(z.string()).optional().describe("Fallback model IDs to try if primary fails"),
  description: z.string().describe("Description of the tool's purpose"),
  prompt: z.string().describe("System prompt to use with this tool")
});

const ConfigSchema = z.object({
  models: z.record(z.string(), ModelConfigSchema),
  tools: z.record(z.string(), ToolConfigSchema),
  fallback: z.object({
    enabled: z.boolean().default(true).describe("Enable global fallback behavior"),
    maxAttempts: z.number().default(3).describe("Maximum fallback attempts per tool call"),
    skipCircuitBreaker: z.boolean().default(false).describe("Skip circuit breaker check for fallbacks")
  }).optional().describe("Global fallback configuration")
});

export type Config = z.infer<typeof ConfigSchema>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export type CliModelConfig = z.infer<typeof CliModelConfigSchema>;
export type ApiModelConfig = z.infer<typeof ApiModelConfigSchema>;
export type ToolConfig = z.infer<typeof ToolConfigSchema>;

// Utility function to resolve environment variables in configuration
export function resolveEnvVariable(value: string): string {
  if (value.startsWith("env:")) {
    const envVar = value.substring(4);
    const envValue = process.env[envVar];
    if (!envValue) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
    return envValue;
  }
  return value;
}

// Enhanced configuration validation with detailed error messages
export function validateConfig(config: any): Config {
  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      throw new Error(`Configuration validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}

// Load configuration from file
export function loadConfig(configPath: string): Config {
  try {
    const rawConfig = fs.readFileSync(configPath, "utf8");
    const jsonConfig = JSON.parse(rawConfig);
    return validateConfig(jsonConfig);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in config file: ${error.message}`);
    }
    throw new Error(`Failed to load config: ${error instanceof Error ? error.message : error}`);
  }
}

// Configuration manager with hot-reload capabilities
export class ConfigManager extends EventEmitter {
  private config: Config;
  private configPath: string;
  private watcher: fs.FSWatcher | null = null;
  private reloadTimeout: NodeJS.Timeout | null = null;

  constructor(configPath: string) {
    super();
    this.configPath = configPath;
    this.config = loadConfig(configPath);
    this.setupWatcher();
  }

  private setupWatcher() {
    try {
      this.watcher = fs.watch(this.configPath, (eventType) => {
        if (eventType === 'change') {
          this.debounceReload();
        }
      });
    } catch (error) {
      console.warn(`Failed to setup config watcher: ${error instanceof Error ? error.message : error}`);
    }
  }

  private debounceReload() {
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
    }
    
    this.reloadTimeout = setTimeout(() => {
      this.reloadConfig();
    }, 1000); // Wait 1 second before reloading
  }

  private reloadConfig() {
    try {
      const newConfig = loadConfig(this.configPath);
      const oldConfig = this.config;
      this.config = newConfig;
      
      this.emit('configReloaded', { oldConfig, newConfig });
      console.error('Configuration reloaded successfully');
    } catch (error) {
      this.emit('configError', error);
      console.error(`Failed to reload config: ${error instanceof Error ? error.message : error}`);
    }
  }

  public getConfig(): Config {
    return this.config;
  }

  public validateCurrentConfig(): { valid: boolean; errors?: string[] } {
    try {
      validateConfig(this.config);
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        errors: error instanceof Error ? [error.message] : ['Unknown validation error'] 
      };
    }
  }

  public destroy() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
      this.reloadTimeout = null;
    }
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
  // When run via npx, __dirname might not be reliable, so we'll look in multiple locations
  const possiblePaths = [
    path.join(__dirname, "../../templates/cohort.config.json"),
    path.join(__dirname, "../templates/cohort.config.json"),
    path.join(__dirname, "templates/cohort.config.json"),
    path.join(process.cwd(), "templates/cohort.config.json")
  ];
  
  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  
  // If none found, try to load the full template from the package
  let defaultConfig;
  try {
    const fullTemplatePath = path.join(__dirname, "../templates/cohort.full.template.json");
    if (fs.existsSync(fullTemplatePath)) {
      defaultConfig = JSON.parse(fs.readFileSync(fullTemplatePath, "utf8"));
    } else {
      // Fallback to embedded full config
      defaultConfig = require("../cohort.config.json");
    }
  } catch (error) {
    // Last resort minimal config
    defaultConfig = {
      "models": {
        "claude-code": {
          "provider": "cli",
          "command": "claude -p"
        }
      },
      "tools": {
        "assistant": {
          "model": "claude-code",
          "description": "General purpose AI assistant",
          "prompt": "You are a helpful AI assistant."
        }
      }
    };
  }
  
  // Try user's home directory first, fallback to temp directory
  const possibleTempPaths = [
    path.join(os.homedir(), ".cohort", "cohort.config.json"),
    path.join(os.tmpdir(), "cohort.config.json"),
    path.join(process.cwd(), "cohort.config.json")
  ];
  
  for (const tempConfigPath of possibleTempPaths) {
    try {
      // Ensure directory exists
      const dir = path.dirname(tempConfigPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(tempConfigPath, JSON.stringify(defaultConfig, null, 2));
      return tempConfigPath;
    } catch (error) {
      // Continue to next path if this one fails
      continue;
    }
  }
  
  throw new Error("Unable to create configuration file in any writable location");
}