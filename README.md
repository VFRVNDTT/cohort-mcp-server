# Cohort MCP Server

Cohort is an enterprise-grade MCP (Model Context Protocol) server that orchestrates collaboration between multiple AI models across 30 specialized intelligence tools. It provides comprehensive AI-to-AI communication optimization, enabling seamless interaction between CLI-based models (Claude Code, Gemini CLI), API-based models (Anthropic, Google, OpenAI), and local models via Ollama.

## Key Features

-   **30 Specialized Intelligence Tools**: Comprehensive coverage for development, security, research, analysis, debugging, testing, refactoring, and more
-   **Multi-Provider Support**: CLI tools (claude-code, gemini), API providers (Anthropic, Google, OpenAI, OpenRouter), and local models (Ollama)
-   **Advanced Memory Management**: Persistent context across sessions with cross-model intelligence adaptation
-   **Circuit Breaker & Retry Logic**: Enterprise-grade error handling with exponential backoff and failure classification
-   **CLI AI Optimization**: Enhanced response formatting specifically designed for AI-to-AI consumption
-   **Dynamic Configuration**: Hot-reload configuration changes without server restart
-   **Comprehensive Logging**: Debug logging with execution metrics and performance profiling

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
      ]
    }
  }
}
```

**Note**: You must publish this package to npm as `cohort-mcp-server` for the `npx` command to work.

## Configuration

The Cohort server uses a `cohort.config.json` file for configuration. The server searches for this file in the following order:

1.  Path specified by the `COHORT_CONFIG_PATH` environment variable
2.  `cohort.config.json` in the current working directory  
3.  Built-in default configuration (fallback)

**Important**: Copy one of the template files (`templates/cohort.full.template.json` or `templates/cohort.minimal.template.json`) to `cohort.config.json` in your project root to ensure you get all 30 tools.

### Supported Model Providers

- **CLI Models**: `claude-code`, `gemini` (command-line tools)
- **API Providers**: Anthropic, Google, OpenAI, OpenRouter
- **Local Models**: Ollama (self-hosted)

### Available Intelligence Tools (30 total)

#### Development & Code Generation
- `code_generator` - Comprehensive code generation and architecture analysis
- `debug_expert` - Advanced debugging and error analysis
- `code_analyzer` - Complete code quality and structure analysis
- `refactoring_expert` - Code optimization and modernization

#### Security & Quality Assurance  
- `security_auditor` - Comprehensive security analysis and threat intelligence
- `test_orchestrator` - Testing strategy and quality assurance

#### Research & Documentation
- `web_researcher` - Multi-source research and knowledge synthesis
- `documentation_finder` - Technical documentation and resource analysis
- `context_expander` - Context expansion and knowledge mapping
- `technical_writer` - Technical writing and content creation
- `documentation_architect` - Documentation architecture and content strategy

#### Project Management & Architecture
- `project_explorer` - Project intelligence and architecture analysis
- `dependency_resolver` - Dependency analysis and resolution
- `migration_assistant` - Technology migration and transformation
- `task_coordinator` - Advanced task orchestration and workflow coordination
- `decision_recorder` - Architectural decision management
- `system_designer` - System architecture and distributed systems design

#### DevOps & Infrastructure
- `deployment_coordinator` - Deployment and DevOps orchestration
- `infrastructure_analyzer` - Infrastructure analysis and optimization
- `pipeline_optimizer` - CI/CD pipeline optimization

#### Advanced Tools & Systems
- `ui_architect` - UI/UX architecture and design systems
- `data_engineer` - Data engineering and analytics architecture
- `consensus_builder` - Multi-perspective consensus building
- `workflow_orchestrator` - Advanced workflow orchestration
- `context_manager` - Context intelligence and information management
- `memory_system` - Memory management and knowledge persistence
- `pattern_detector` - Pattern recognition and trend analysis
- `mcp_tool_manager` - MCP ecosystem and tool orchestration
- `plugin_system` - Plugin architecture and extensible systems
- `api_gateway` - API gateway and service mesh architecture

*Full configuration with all 30 tools is available in the `templates/` directory.*

### Configuration Path Resolution

The server follows this priority order for configuration loading:

1. **Environment Variable**: `COHORT_CONFIG_PATH` - Absolute path to your config file
2. **Working Directory**: `./cohort.config.json` - Config in current directory
3. **Built-in Fallback**: Internal default configuration (limited tool set)

**Recommended Setup**: 
```bash
# Copy full template
cp templates/cohort.full.template.json ./cohort.config.json

# Or copy minimal template  
cp templates/cohort.minimal.template.json ./cohort.config.json

# Or set custom path
export COHORT_CONFIG_PATH="/path/to/your/cohort.config.json"
```

## How It Works

Cohort operates as an intelligent orchestration layer with the following architecture:

### AI-to-AI Optimization
- **Enhanced Response Formatting**: Responses optimized specifically for AI consumption with rich metadata
- **Cross-Model Intelligence**: Context adaptation based on target model capabilities  
- **Universal Compatibility**: Standardized output format for seamless CLI AI integration

### Memory & Context Management
- **Persistent Memory**: Context preserved across sessions with intelligent summarization
- **Cross-Tool Context**: Shared context between different intelligence tools
- **Performance Profiling**: Execution metrics and optimization recommendations

### Error Handling & Reliability
- **Circuit Breaker Pattern**: Automatic failure detection and recovery
- **Retry Logic**: Exponential backoff with error classification
- **Graceful Degradation**: Fallback strategies for partial failures

### Tool Delegation Workflow
1. Request received by MCP server
2. Tool handler executes with memory context
3. Sub-tool calls processed automatically  
4. Results enhanced with AI-optimized metadata
5. Response delivered with cross-model compatibility

This enables powerful AI collaboration workflows where different models contribute their specialized capabilities to complex tasks.

## Configuration Templates

Two template configurations are provided:

- **`templates/cohort.full.template.json`**: Complete configuration with all 30 tools and 7 model providers
- **`templates/cohort.minimal.template.json`**: Essential 10 tools for core development workflows

Copy either template to your project root as `cohort.config.json` and customize as needed.

## Quick Start

1. Install via MCP client configuration (see Installation section)
2. Copy a template configuration: `cp templates/cohort.full.template.json ./cohort.config.json`
3. Edit `cohort.config.json` and add your API keys directly to the `apiKey` fields
4. The server will automatically detect and use your configuration

### API Key Configuration

You can configure API keys in two ways:

**Option 1: Direct API Keys (Recommended for personal use)**
```json
{
  "models": {
    "claude-api": {
      "provider": "anthropic",
      "apiKey": "sk-ant-your-actual-key-here",
      "model": "claude-3-5-sonnet-20241022"
    }
  }
}
```

**Option 2: Environment Variables (Recommended for production)**
```json
{
  "models": {
    "claude-api": {
      "provider": "anthropic", 
      "apiKey": "env:ANTHROPIC_API_KEY",
      "model": "claude-3-5-sonnet-20241022"
    }
  }
}
```

When using the `env:` prefix, make sure the environment variable is set in your system.

### Fallback Model Configuration

Cohort supports configurable fallback models for enhanced reliability. If the primary model fails, it will automatically try fallback models in order:

```json
{
  "fallback": {
    "enabled": true,
    "maxAttempts": 3,
    "skipCircuitBreaker": false
  },
  "tools": {
    "code_generator": {
      "model": "gemini-cli",
      "fallbackModels": ["claude-api", "gpt-4"],
      "description": "...",
      "prompt": "..."
    }
  }
}
```

**Fallback Configuration Options:**
- `enabled`: Enable/disable fallback behavior globally (default: true)
- `maxAttempts`: Maximum number of fallback models to try (default: 3)  
- `skipCircuitBreaker`: Skip circuit breaker checks for fallback models (default: false)

**Per-Tool Fallbacks:**
- `fallbackModels`: Array of model IDs to try if the primary model fails
- Models are tried in order until one succeeds
- Fallbacks are skipped for authentication and configuration errors

## Advanced Features

### Dynamic Configuration Reload
- Configuration changes are detected automatically
- No server restart required for tool updates
- Hot-swappable model assignments

### Memory System
- Persistent context across sessions
- Cross-tool knowledge sharing  
- Intelligent context summarization
- Performance metrics tracking

### Enterprise Reliability
- Circuit breaker protection
- Exponential backoff retry logic
- Comprehensive error classification
- Debug logging with performance profiling

## Documentation

- **[Tool Reference](TOOLS.md)**: Complete documentation for all 30 intelligence tools
- **[Troubleshooting Guide](TROUBLESHOOTING.md)**: Common issues and solutions
- **[Contributing Guidelines](CONTRIBUTING.md)**: How to contribute to the project

## Development

Built with TypeScript and the MCP SDK. Features comprehensive error handling, memory management, and AI-to-AI communication optimization.

## License

[Add your license here]