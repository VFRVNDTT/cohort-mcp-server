# Contributing to Cohort MCP Server

Thank you for your interest in contributing to Cohort! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Adding New Tools](#adding-new-tools)
- [Adding Model Providers](#adding-model-providers)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- Node.js 18+ 
- TypeScript knowledge
- Understanding of MCP (Model Context Protocol)
- Git

### Development Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd cohort
npm install
```

2. **Build Project**
```bash
npm run build
```

3. **Set Up Configuration**
```bash
cp templates/cohort.full.template.json ./cohort.config.json
# Edit cohort.config.json with your API keys
```

4. **Test Locally**
```bash
npm run dev
# Or test MCP integration
node build/index.js
```

## Project Structure

```
cohort/
├── src/
│   ├── config.ts          # Configuration management
│   ├── models.ts          # Model execution logic
│   ├── memory.ts          # Memory management system
│   ├── server.ts          # Main MCP server implementation
│   └── index.ts           # Entry point
├── templates/             # Configuration templates
│   ├── cohort.full.template.json
│   └── cohort.minimal.template.json
├── build/                 # Compiled TypeScript
├── docs/                  # Additional documentation
├── README.md             # Main documentation
├── TOOLS.md              # Tool reference
├── TROUBLESHOOTING.md    # Troubleshooting guide
└── CONTRIBUTING.md       # This file
```

### Key Components

#### Configuration System (`src/config.ts`)
- Dynamic configuration loading
- Hot-reload capabilities
- Template management
- Environment variable resolution

#### Model Execution (`src/models.ts`)
- Multi-provider support (CLI, API, Local)
- Provider-specific implementations
- Error handling and retries

#### Memory Management (`src/memory.ts`)
- Persistent context storage
- Cross-tool knowledge sharing
- Performance metrics tracking
- Intelligent summarization

#### Server Implementation (`src/server.ts`)
- MCP protocol handling
- Tool orchestration
- Circuit breaker pattern
- AI-to-AI optimization

## Contributing Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier defaults
- **Linting**: ESLint configuration
- **Naming**: Descriptive, camelCase for variables, PascalCase for types

### Commit Messages

Use conventional commit format:
```
type(scope): description

feat(tools): add new code analysis capabilities
fix(memory): resolve context persistence issue
docs(readme): update installation instructions
refactor(server): improve error handling logic
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Branch Naming

- `feature/tool-name` - New tool implementations
- `feature/provider-name` - New model providers
- `fix/issue-description` - Bug fixes
- `docs/section-name` - Documentation updates
- `refactor/component-name` - Code refactoring

## Adding New Tools

### 1. Define Tool Configuration

Add to both template files:

```json
{
  "tools": {
    "new_tool_name": {
      "model": "gemini-cli",
      "description": "Brief description of tool capabilities",
      "prompt": "INTELLIGENCE PROVIDER: Tool Name\\n\\nMISSION: Detailed mission statement..."
    }
  }
}
```

### 2. Tool Prompt Guidelines

All tool prompts should follow the INTELLIGENCE PROVIDER format:

```
INTELLIGENCE PROVIDER: [Tool Category and Purpose]

MISSION: [Detailed mission statement with specific capabilities]

**INTELLIGENCE DELIVERY:**

1. **[Primary Intelligence Type]:**
   - [Specific capability 1]
   - [Specific capability 2]
   - [Context analysis requirements]

2. **[Secondary Intelligence Type]:**
   - [Advanced features]
   - [Integration capabilities]
   - [Optimization strategies]

3. **[Output Intelligence Type]:**
   - [Response formatting]
   - [Quality assurance]
   - [Validation criteria]

**CONTEXT EXPANSION:**
- [Context requirements]
- [Background data needs]
- [Integration considerations]

**RESPONSE OPTIMIZATION:**
[AI-to-AI optimization instructions]
```

### 3. Intelligence Categories

Assign your tool to the appropriate intelligence type:

- **GENERATIVE_INTELLIGENCE**: Code creation, architecture design
- **ANALYTICAL_INTELLIGENCE**: Analysis, pattern recognition
- **RESEARCH_INTELLIGENCE**: Information gathering, synthesis
- **DIAGNOSTIC_INTELLIGENCE**: Debugging, problem solving
- **COORDINATION_INTELLIGENCE**: Task orchestration, workflow
- **TRANSFORMATION_INTELLIGENCE**: Migration, refactoring
- **VERIFICATION_INTELLIGENCE**: Testing, security, validation
- **DOCUMENTATION_INTELLIGENCE**: Writing, explanation

### 4. Testing New Tools

```bash
# Test tool in isolation
echo '{"tool": "new_tool_name", "query": "test query"}' | node build/index.js

# Test with MCP client
# Configure client and verify tool appears in tool list

# Test error handling
echo '{"tool": "new_tool_name", "query": "intentionally invalid input"}' | node build/index.js
```

### 5. Documentation Requirements

- Add tool to `TOOLS.md` with complete specification
- Update `README.md` tool count and categories
- Add usage examples
- Document any special requirements

## Adding Model Providers

### 1. Extend Model Configuration

Add to templates:

```json
{
  "models": {
    "new-provider": {
      "provider": "new_provider_name",
      "apiKey": "env:NEW_PROVIDER_API_KEY",
      "model": "model-name",
      "baseUrl": "https://api.newprovider.com" // if needed
    }
  }
}
```

### 2. Implement Provider Logic

In `src/models.ts`, add new provider case:

```typescript
case 'new_provider_name':
  return await executeNewProvider(modelConfig, prompt);
```

### 3. Provider Implementation

```typescript
async function executeNewProvider(
  config: ModelConfig, 
  prompt: string
): Promise<string> {
  // Implement API calls
  // Handle authentication
  // Process responses
  // Handle errors appropriately
}
```

### 4. Error Handling

Ensure your provider handles:
- Authentication errors
- Rate limiting
- Network timeouts
- Invalid responses
- Model-specific errors

### 5. Testing Providers

```bash
# Test authentication
export NEW_PROVIDER_API_KEY="your-key"

# Test basic functionality
echo "test prompt" | node -e "
const { executeModel } = require('./build/models');
executeModel({
  provider: 'new_provider_name',
  apiKey: 'env:NEW_PROVIDER_API_KEY',
  model: 'model-name'
}, 'test prompt').then(console.log);
"
```

## Testing

### Unit Tests

```bash
# Run existing tests
npm test

# Add tests for new functionality
# Test files in __tests__/ directory
```

### Integration Tests

```bash
# Test with real MCP client
# Verify tool discovery
# Test tool execution
# Test error scenarios
```

### Manual Testing Checklist

- [ ] Tool appears in MCP client
- [ ] Tool executes successfully
- [ ] Error handling works correctly
- [ ] Memory system integration
- [ ] Circuit breaker functionality
- [ ] Performance metrics captured
- [ ] Debug logging working

## Documentation

### Required Documentation

1. **Code Comments**: All public functions and complex logic
2. **Tool Documentation**: Complete specification in `TOOLS.md`
3. **Configuration Examples**: Working examples in templates
4. **Troubleshooting**: Common issues and solutions
5. **API Documentation**: TypeScript types and interfaces

### Documentation Standards

- Use clear, concise language
- Provide working examples
- Include troubleshooting steps
- Update all relevant files
- Maintain consistency with existing docs

## Pull Request Process

### 1. Pre-submission Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Templates updated (if applicable)
- [ ] Manual testing completed
- [ ] No merge conflicts

### 2. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Documentation
- [ ] Code comments added/updated
- [ ] Documentation files updated
- [ ] Configuration templates updated

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] No console.log statements
- [ ] Error handling implemented
```

### 3. Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainer reviews code quality
3. **Documentation Review**: Ensure docs are updated
4. **Integration Testing**: Verify MCP integration
5. **Approval**: Maintainer approves changes
6. **Merge**: Changes merged to main branch

### 4. Review Criteria

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Does it impact server performance?
- **Security**: Are there any security concerns?
- **Compatibility**: Does it break existing functionality?
- **Documentation**: Is it properly documented?

## Development Best Practices

### Memory Management

- Use the memory system for context persistence
- Clean up resources in error conditions
- Monitor memory usage in long-running operations

### Error Handling

- Use circuit breaker for external API calls
- Classify errors appropriately
- Provide helpful error messages
- Log errors with sufficient context

### Performance

- Minimize API calls where possible
- Use efficient data structures
- Profile performance-critical code
- Monitor execution times

### Security

- Never log API keys or sensitive data
- Validate all external inputs
- Use secure communication protocols
- Follow security best practices

## Release Process

### Version Numbering

Follow semantic versioning (semver):
- `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Build and test package
5. Create git tag
6. Publish to npm
7. Create GitHub release

## Community

### Getting Help

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Discord/Slack: Real-time community chat (if available)

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

## License

By contributing to Cohort, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Cohort! Your efforts help make AI collaboration more powerful and accessible.