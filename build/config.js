"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.getConfigPath = getConfigPath;
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Define Zod schemas for configuration validation
const ModelConfigSchema = zod_1.z.object({
    provider: zod_1.z.literal("cli"),
    command: zod_1.z.string().describe("Command to execute the CLI model")
});
const ToolConfigSchema = zod_1.z.object({
    model: zod_1.z.string().describe("Model ID to use for this tool"),
    description: zod_1.z.string().describe("Description of the tool's purpose"),
    prompt: zod_1.z.string().describe("System prompt to use with this tool")
});
const ConfigSchema = zod_1.z.object({
    models: zod_1.z.record(zod_1.z.string(), ModelConfigSchema),
    tools: zod_1.z.record(zod_1.z.string(), ToolConfigSchema)
});
// Load configuration from file
function loadConfig(configPath) {
    try {
        const rawConfig = fs_1.default.readFileSync(configPath, "utf8");
        const jsonConfig = JSON.parse(rawConfig);
        return ConfigSchema.parse(jsonConfig);
    }
    catch (error) {
        throw new Error(`Failed to load config: ${error instanceof Error ? error.message : error}`);
    }
}
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
    return path_1.default.join(__dirname, "../../templates/cohort.config.json");
}
