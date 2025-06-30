# Architectural Plan: Cohort MCP Server

## 1. High-Level Goal

To create a flexible and user-friendly MCP server named "cohort" that allows multiple AI models (local and API-based) to collaborate on tasks. The server will have a special focus on making `claude-code` and `gemini-cli` work together seamlessly.

## 2. Core Architecture: CLI-Based Model Interaction

The server will be built around a primary orchestrator that can delegate sub-tasks to specialized "tool" models by executing their Command-Line Interfaces (CLIs). This allows for deep integration with tools like Claude Code and Gemini CLI, while remaining flexible enough to support API-based models.

### Workflow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Cohort MCP Server
    participant Main Model (e.g., Claude Code CLI)
    participant Tool Model (e.g., Gemini CLI)

    User->>Cohort MCP Server: "Debug this Python code for me."
    note right of Cohort MCP Server: Load cohort.config.json
    Cohort MCP Server->>Main Model: Execute `claude-code --prompt "..."` command with the user's task and the list of available tools.
    Main Model-->>Cohort MCP Server: Return JSON: { "tool": "debug_expert", "query": "Analyze this code..." } via stdout.
    alt Tool call detected
        Cohort MCP Server->>Tool Model: Find 'debug_expert' tool in config. Execute `gemini-cli --prompt "..."` with the sub-task.
        Tool Model-->>Cohort MCP Server: Return analysis of the code via stdout.
        Cohort MCP Server->>Main Model: Append tool result to conversation history and execute `claude-code` again.
        Main Model-->>Cohort MCP Server: Use analysis to generate final, debugged code.
    end
    Cohort MCP Server-->>User: Stream final response to the user.
```

## 3. Proposed Project Structure

The project will be a standard TypeScript application for maintainability and scalability.

```
cohort/
├── src/
│   ├── index.ts          # Main server entry point, handles MCP connection.
│   ├── server.ts         # Core server logic, defines the main 'run' tool.
│   ├── config.ts         # Handles loading and validating the user's config file.
│   ├── models.ts         # Abstractions for different model providers (CLI, API, etc.).
│   └── prompt_builder.ts # Logic for constructing prompts with tool-calling instructions.
├── templates/
│   └── cohort.config.json # A default configuration file for new users.
├── package.json          # Project metadata, dependencies, and scripts.
├── tsconfig.json         # TypeScript compiler options.
└── bin/
    └── cohort.js         # The executable script for 'npx' setup.
```

## 4. User Configuration (`cohort.config.json`)

A user-editable configuration file is central to the project's flexibility. A setup command will place a default version of this file in a user-accessible location (e.g., `~/.config/cohort/`).

```json
{
  "mainModel": "claude-code",
  "models": {
    "claude-code": {
      "provider": "cli",
      "command": "claude-code --prompt"
    },
    "gemini-cli": {
      "provider": "cli",
      "command": "gemini-cli --prompt"
    },
    "gemini-api": {
      "provider": "google",
      "apiKey": "env:GOOGLE_API_KEY"
    },
    "local-llama": {
      "provider": "ollama",
      "baseURL": "http://localhost:11434",
      "model": "llama3"
    }
  },
  "tools": {
    "code_generator": {
      "model": "claude-code",
      "description": "For writing and refactoring high-quality code.",
      "prompt": "You are an expert programmer. Your goal is to write clean, efficient, and maintainable code based on the user's request."
    },
    "debug_expert": {
      "model": "gemini-cli",
      "description": "For analyzing code, identifying bugs, and suggesting fixes.",
      "prompt": "You are a debugging specialist. Analyze the provided code and error messages to find the root cause and propose a solution."
    }
  }
}
```

## 5. Easy Setup (`npx cohort-mcp-server setup`)

A simple, one-time setup command will be provided to enhance user experience. The `bin/cohort.js` script will:
1.  Create a configuration directory (e.g., `~/.config/cohort/`).
2.  Copy the default `cohort.config.json` into it.
3.  Print clear instructions for the user to add the "cohort" server to their MCP client's settings file.