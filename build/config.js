"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
exports.resolveEnvVariable = resolveEnvVariable;
exports.validateConfig = validateConfig;
exports.loadConfig = loadConfig;
exports.getConfigPath = getConfigPath;
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const events_1 = require("events");
// Define Zod schemas for configuration validation
const CliModelConfigSchema = zod_1.z.object({
    provider: zod_1.z.literal("cli"),
    command: zod_1.z.string().describe("Command to execute the CLI model")
});
const ApiModelConfigSchema = zod_1.z.object({
    provider: zod_1.z.enum(["google", "anthropic", "openai", "ollama", "openrouter"]),
    apiKey: zod_1.z.string().describe("API key for the model provider (can use env: prefix)"),
    model: zod_1.z.string().describe("Model name/identifier"),
    baseUrl: zod_1.z.string().optional().describe("Base URL for the API (for custom endpoints)")
});
const ModelConfigSchema = zod_1.z.union([CliModelConfigSchema, ApiModelConfigSchema]);
const ToolConfigSchema = zod_1.z.object({
    model: zod_1.z.string().describe("Primary model ID to use for this tool"),
    fallbackModels: zod_1.z.array(zod_1.z.string()).optional().describe("Fallback model IDs to try if primary fails"),
    description: zod_1.z.string().describe("Description of the tool's purpose"),
    prompt: zod_1.z.string().describe("System prompt to use with this tool")
});
const ConfigSchema = zod_1.z.object({
    models: zod_1.z.record(zod_1.z.string(), ModelConfigSchema),
    tools: zod_1.z.record(zod_1.z.string(), ToolConfigSchema),
    fallback: zod_1.z.object({
        enabled: zod_1.z.boolean().default(true).describe("Enable global fallback behavior"),
        maxAttempts: zod_1.z.number().default(3).describe("Maximum fallback attempts per tool call"),
        skipCircuitBreaker: zod_1.z.boolean().default(false).describe("Skip circuit breaker check for fallbacks")
    }).optional().describe("Global fallback configuration")
});
// Utility function to resolve environment variables in configuration
function resolveEnvVariable(value) {
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
function validateConfig(config) {
    try {
        return ConfigSchema.parse(config);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
            throw new Error(`Configuration validation failed:\n${errorMessages}`);
        }
        throw error;
    }
}
// Load configuration from file
function loadConfig(configPath) {
    try {
        const rawConfig = fs_1.default.readFileSync(configPath, "utf8");
        const jsonConfig = JSON.parse(rawConfig);
        return validateConfig(jsonConfig);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in config file: ${error.message}`);
        }
        throw new Error(`Failed to load config: ${error instanceof Error ? error.message : error}`);
    }
}
// Configuration manager with hot-reload capabilities
class ConfigManager extends events_1.EventEmitter {
    config;
    configPath;
    watcher = null;
    reloadTimeout = null;
    constructor(configPath) {
        super();
        this.configPath = configPath;
        this.config = loadConfig(configPath);
        this.setupWatcher();
    }
    setupWatcher() {
        try {
            this.watcher = fs_1.default.watch(this.configPath, (eventType) => {
                if (eventType === 'change') {
                    this.debounceReload();
                }
            });
        }
        catch (error) {
            console.warn(`Failed to setup config watcher: ${error instanceof Error ? error.message : error}`);
        }
    }
    debounceReload() {
        if (this.reloadTimeout) {
            clearTimeout(this.reloadTimeout);
        }
        this.reloadTimeout = setTimeout(() => {
            this.reloadConfig();
        }, 1000); // Wait 1 second before reloading
    }
    reloadConfig() {
        try {
            const newConfig = loadConfig(this.configPath);
            const oldConfig = this.config;
            this.config = newConfig;
            this.emit('configReloaded', { oldConfig, newConfig });
            console.error('Configuration reloaded successfully');
        }
        catch (error) {
            this.emit('configError', error);
            console.error(`Failed to reload config: ${error instanceof Error ? error.message : error}`);
        }
    }
    getConfig() {
        return this.config;
    }
    validateCurrentConfig() {
        try {
            validateConfig(this.config);
            return { valid: true };
        }
        catch (error) {
            return {
                valid: false,
                errors: error instanceof Error ? [error.message] : ['Unknown validation error']
            };
        }
    }
    destroy() {
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
exports.ConfigManager = ConfigManager;
// Get the config path
function getConfigPath() {
    // 1. From environment variable
    if (process.env.COHORT_CONFIG_PATH) {
        return process.env.COHORT_CONFIG_PATH;
    }
    // 2. From current working directory
    const localConfig = path_1.default.join(process.cwd(), "cohort.config.json");
    if (fs_1.default.existsSync(localConfig)) {
        return localConfig;
    }
    // 3. Bundled template as a fallback
    // When run via npx, __dirname might not be reliable, so we'll look in multiple locations
    const possiblePaths = [
        path_1.default.join(__dirname, "../../templates/cohort.config.json"),
        path_1.default.join(__dirname, "../templates/cohort.config.json"),
        path_1.default.join(__dirname, "templates/cohort.config.json"),
        path_1.default.join(process.cwd(), "templates/cohort.config.json")
    ];
    for (const configPath of possiblePaths) {
        if (fs_1.default.existsSync(configPath)) {
            return configPath;
        }
    }
    // If none found, try to load the full template from the package
    let defaultConfig;
    try {
        const fullTemplatePath = path_1.default.join(__dirname, "../templates/cohort.full.template.json");
        if (fs_1.default.existsSync(fullTemplatePath)) {
            defaultConfig = JSON.parse(fs_1.default.readFileSync(fullTemplatePath, "utf8"));
        }
        else {
            // Fallback to embedded full config
            defaultConfig = require("../cohort.config.json");
        }
    }
    catch (error) {
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
        path_1.default.join(os_1.default.homedir(), ".cohort", "cohort.config.json"),
        path_1.default.join(os_1.default.tmpdir(), "cohort.config.json"),
        path_1.default.join(process.cwd(), "cohort.config.json")
    ];
    for (const tempConfigPath of possibleTempPaths) {
        try {
            // Ensure directory exists
            const dir = path_1.default.dirname(tempConfigPath);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(tempConfigPath, JSON.stringify(defaultConfig, null, 2));
            return tempConfigPath;
        }
        catch (error) {
            // Continue to next path if this one fails
            continue;
        }
    }
    throw new Error("Unable to create configuration file in any writable location");
}
