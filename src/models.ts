import { spawn, execSync } from "child_process";
import { ModelConfig, CliModelConfig, ApiModelConfig, resolveEnvVariable } from "./config";
import { ToolConfig } from "./config";
import { appendFileSync } from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Ollama } from "ollama";
import { existsSync } from "fs";
import { join } from "path";

function debugLog(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  try {
    appendFileSync("debug.log", logMessage);
  } catch (e) {
    // Silently fail if debug logging isn't available
  }
}

// Enhanced CLI tool availability checking
function isCliToolAvailable(toolName: string): boolean {
  try {
    // Try to find the tool using 'which' command
    execSync(`which ${toolName}`, { stdio: 'ignore' });
    return true;
  } catch {
    // If which fails, try some common installation paths
    const commonPaths = [
      `/usr/local/bin/${toolName}`,
      `/opt/homebrew/bin/${toolName}`,
      `/usr/bin/${toolName}`,
      join(process.env.HOME || '', `.local/bin/${toolName}`),
      join(process.env.HOME || '', `bin/${toolName}`)
    ];
    
    return commonPaths.some(path => existsSync(path));
  }
}

// Enhanced PATH for CLI tools
function enhancePathForCliTools(currentPath: string): string {
  const additionalPaths = [
    '/usr/local/bin',
    '/opt/homebrew/bin',
    '/usr/bin',
    '/bin',
    join(process.env.HOME || '', '.local/bin'),
    join(process.env.HOME || '', 'bin')
  ];
  
  const pathArray = currentPath.split(':');
  
  // Add missing paths
  additionalPaths.forEach(path => {
    if (!pathArray.includes(path) && existsSync(path)) {
      pathArray.unshift(path); // Add to beginning for priority
    }
  });
  
  return pathArray.join(':');
}

// Enhanced CLI error classification
function classifyCliError(exitCode: number, stderr: string, command: string): string {
  const stderrLower = stderr?.toLowerCase() || '';
  
  if (exitCode === 127 || stderrLower.includes('command not found') || stderrLower.includes('not found')) {
    return `CLI tool '${command}' not found. Please ensure it is installed and in your PATH. Available installation methods:\n` +
           `- For gemini: Install from Google AI SDK\n` +
           `- For claude-code: Install from Anthropic\n` +
           `- Check tool documentation for installation instructions`;
  }
  
  if (exitCode === 1 && (stderrLower.includes('auth') || stderrLower.includes('api key') || stderrLower.includes('unauthorized'))) {
    return `Authentication error with CLI tool '${command}'. Please check:\n` +
           `- API keys are correctly set in environment variables\n` +
           `- Authentication tokens are valid and not expired\n` +
           `- Tool is properly logged in or configured`;
  }
  
  if (stderrLower.includes('rate limit') || stderrLower.includes('quota exceeded')) {
    return `Rate limit exceeded for CLI tool '${command}'. Please wait before retrying or check your quota limits.`;
  }
  
  if (stderrLower.includes('network') || stderrLower.includes('connection') || stderrLower.includes('timeout')) {
    return `Network error with CLI tool '${command}'. Please check your internet connection and try again.`;
  }
  
  // Generic error with exit code and stderr
  return `CLI tool '${command}' failed with exit code ${exitCode}: ${stderr}`;
}

export async function executeModel(modelConfig: ModelConfig, prompt: string): Promise<string> {
  try {
    debugLog(`Executing model with provider: ${modelConfig.provider}`);
    
    switch (modelConfig.provider) {
      case "cli":
        return await executeCliModel(modelConfig.command, prompt);
      case "google":
        return await executeGoogleModel(modelConfig, prompt);
      case "anthropic":
        return await executeAnthropicModel(modelConfig, prompt);
      case "openai":
        return await executeOpenAIModel(modelConfig, prompt);
      case "ollama":
        return await executeOllamaModel(modelConfig, prompt);
      case "openrouter":
        return await executeOpenRouterModel(modelConfig, prompt);
      default:
        throw new Error(`Unsupported provider: ${(modelConfig as any).provider}`);
    }
  } catch (error) {
    debugLog(`Model execution failed for provider ${modelConfig.provider}: ${error instanceof Error ? error.message : error}`);
    
    // Enhanced error handling with fallback suggestions
    if (error instanceof Error) {
      let enhancedMessage = `[${modelConfig.provider}] ${error.message}`;
      
      // Add fallback suggestions for CLI errors
      if (modelConfig.provider === 'cli' && error.message.includes('not found')) {
        enhancedMessage += `\n\nFallback suggestions:\n` +
                          `- Switch to API-based models if available\n` +
                          `- Install the required CLI tool\n` +
                          `- Check tool documentation for setup instructions`;
      }
      
      error.message = enhancedMessage;
    }
    throw error;
  }
}

function escapeShellArg(arg: string): string {
  // Escape single quotes by ending the quoted string, adding an escaped quote, and starting a new quoted string
  return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
}

async function executeCliModel(command: string, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Enhanced CLI tool availability and environment detection
    const [cmd, ...baseArgs] = command.split(" ");
    
    // Check if CLI tool is available before execution
    if (!isCliToolAvailable(cmd)) {
      reject(`CLI tool '${cmd}' is not available or not in PATH. Please ensure it is installed and accessible.`);
      return;
    }
    
    // Add the prompt as a properly escaped argument
    const args = [...baseArgs, escapeShellArg(prompt)];
    
    debugLog(`Executing: ${cmd} ${args.join(" ")} with prompt: ${prompt.substring(0, 100)}...`);
    debugLog(`Environment: PATH=${process.env.PATH?.substring(0, 200)}...`);
    
    const child = spawn(cmd, args, {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,  // Enable shell to handle argument parsing properly
      env: {
        ...process.env,
        // Ensure common CLI tools are in PATH
        PATH: enhancePathForCliTools(process.env.PATH || '')
      }
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
        // Enhanced error classification for CLI tools
        const enhancedError = classifyCliError(code || 1, stderr, cmd);
        reject(enhancedError);
      } else {
        resolve(stdout.trim());
      }
    });

    // Close stdin immediately since we're not using it
    child.stdin.end();
  });
}

async function executeGoogleModel(modelConfig: ApiModelConfig, prompt: string): Promise<string> {
  const apiKey = resolveEnvVariable(modelConfig.apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelConfig.model });
  
  debugLog(`Executing Google model ${modelConfig.model} with prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    debugLog(`Google model response: ${text.substring(0, 200)}...`);
    return text;
  } catch (error) {
    throw new Error(`Google API error: ${error instanceof Error ? error.message : error}`);
  }
}

async function executeAnthropicModel(modelConfig: ApiModelConfig, prompt: string): Promise<string> {
  const apiKey = resolveEnvVariable(modelConfig.apiKey);
  const anthropic = new Anthropic({ apiKey });
  
  debugLog(`Executing Anthropic model ${modelConfig.model} with prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    const result = await anthropic.messages.create({
      model: modelConfig.model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }]
    });
    
    const text = result.content[0].type === "text" ? result.content[0].text : "";
    debugLog(`Anthropic model response: ${text.substring(0, 200)}...`);
    return text;
  } catch (error) {
    throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : error}`);
  }
}

async function executeOpenAIModel(modelConfig: ApiModelConfig, prompt: string): Promise<string> {
  const apiKey = resolveEnvVariable(modelConfig.apiKey);
  const openai = new OpenAI({ 
    apiKey,
    ...(modelConfig.baseUrl && { baseURL: modelConfig.baseUrl })
  });
  
  debugLog(`Executing OpenAI model ${modelConfig.model} with prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    const result = await openai.chat.completions.create({
      model: modelConfig.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096
    });
    
    const text = result.choices[0]?.message?.content || "";
    debugLog(`OpenAI model response: ${text.substring(0, 200)}...`);
    return text;
  } catch (error) {
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : error}`);
  }
}

async function executeOllamaModel(modelConfig: ApiModelConfig, prompt: string): Promise<string> {
  const ollama = new Ollama({ 
    host: modelConfig.baseUrl || "http://localhost:11434" 
  });
  
  debugLog(`Executing Ollama model ${modelConfig.model} with prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    const result = await ollama.generate({
      model: modelConfig.model,
      prompt: prompt,
      stream: false
    });
    
    const text = result.response || "";
    debugLog(`Ollama model response: ${text.substring(0, 200)}...`);
    return text;
  } catch (error) {
    throw new Error(`Ollama API error: ${error instanceof Error ? error.message : error}`);
  }
}

async function executeOpenRouterModel(modelConfig: ApiModelConfig, prompt: string): Promise<string> {
  const apiKey = resolveEnvVariable(modelConfig.apiKey);
  const openai = new OpenAI({ 
    apiKey,
    baseURL: modelConfig.baseUrl || "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://github.com/your-org/cohort-mcp-server",
      "X-Title": "Cohort MCP Server"
    }
  });
  
  debugLog(`Executing OpenRouter model ${modelConfig.model} with prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    const result = await openai.chat.completions.create({
      model: modelConfig.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096
    });
    
    const text = result.choices[0]?.message?.content || "";
    debugLog(`OpenRouter model response: ${text.substring(0, 200)}...`);
    return text;
  } catch (error) {
    throw new Error(`OpenRouter API error: ${error instanceof Error ? error.message : error}`);
  }
}


// Builds the system prompt for a tool by combining the tool's prompt with tool-calling instructions
export function buildToolPrompt(toolConfig: ToolConfig, availableTools: Record<string, ToolConfig>, contextSummary?: string): string {
  const toolList = Object.entries(availableTools)
    .map(([name, config]) => `- ${name}: ${config.description}`)
    .join("\n");
  
  let prompt = `${toolConfig.prompt}

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

  // Add context summary if provided
  if (contextSummary && contextSummary.trim() !== "No previous context available.") {
    prompt += `

CONTEXT FROM PREVIOUS INTERACTIONS:
${contextSummary}

Use this context to provide more informed and consistent responses. Reference previous work when relevant.`;
  }

  return prompt;
}