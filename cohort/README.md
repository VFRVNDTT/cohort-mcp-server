# Cohort MCP Server

Cohort is a powerful, flexible, and user-friendly MCP (Model Context Protocol) server designed to orchestrate collaboration between multiple AI models. It allows you to define custom "tools" (similar to roles or modes), assign specific AI models to them, and enable seamless interaction between these tools.

The server has a special focus on making CLI-based models like Claude Code and Gemini CLI work together, while also supporting API-based models (Google, Anthropic) and local models via Ollama.

## Features

-   **Multi-Model Orchestration**: Enables different AI models to collaborate on complex tasks.
-   **CLI and API Support**: Natively supports both command-line interface and API-based models.
-   **Flexible Tool Configuration**: Define custom tools and assign specific models to them.
-   **Easy Installation**: A simple `npx`-based setup for a smooth user experience.
-   **Environment Variable Support**: Securely manage API keys using environment variables.

## Installation

To use the Cohort MCP server, you need to add it to your MCP client's configuration file (e.g., `claude_desktop_config.json` on macOS).

Add the following JSON block to your `mcpServers` object:

```json
{
  "mcpServers": {
    "cohort": {
      "command": "npx",
      "args": [
        "-y",
        "--package=cohort-mcp-server",
        "cohort-mcp-server"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "GOOGLE_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
      }
    }
  }
}
```

**Note**: You must publish this package to npm as `cohort-mcp-server` for the `npx` command to work.

## Configuration

The Cohort server is configured using a `cohort.config.json` file. The server will look for this file in the following order:

1.  A path specified by the `COHORT_CONFIG_PATH` environment variable.
2.  A file named `cohort.config.json` in the current working directory.
3.  The default configuration file bundled with the package.

Here is an example of the `cohort.config.json` file:

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

## How It Works

The Cohort server acts as an orchestrator. When it receives a request, it passes it to the `mainModel`. This model can then delegate sub-tasks to other specialized "tool" models by outputting a specific JSON structure. The server intercepts this JSON, executes the appropriate tool, and feeds the result back to the main model to continue its task.

This allows for a powerful workflow where you can leverage the strengths of different models for different parts of a task.