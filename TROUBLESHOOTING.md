# Troubleshooting Guide

This guide helps you resolve common issues with the Cohort MCP Server.

## Quick Diagnostics

### Check Server Status
```bash
# Check if MCP client is connecting
tail -f debug.log

# Look for initialization messages
grep "Server initializing" debug.log
grep "Configuration manager initialized" debug.log
```

### Verify Configuration
```bash
# Check if config file exists
ls -la cohort.config.json

# Validate JSON syntax
python -m json.tool cohort.config.json

# Check environment variables
echo $COHORT_CONFIG_PATH
echo $ANTHROPIC_API_KEY
echo $GOOGLE_API_KEY
```

## Common Issues

### 1. Only 6-8 Tools Available (RESOLVED)

**Problem**: MCP client only shows a limited set of tools instead of all 29.

**Cause**: Client was loading template configuration files with limited tool sets.

**Solution**: ✅ **Fixed in latest version**
- Template files renamed to prevent auto-loading
- Both templates now include all 29 tools
- Copy template to proper location:

```bash
cp templates/cohort.full.template.json ./cohort.config.json
```

---

### 2. Server Won't Start

**Symptoms**:
- MCP client shows connection errors
- No debug.log file created
- Tools not appearing in client

**Diagnosis**:
```bash
# Check if server process starts
npx -y --package=cohort-mcp-server cohort-mcp-server

# Look for startup errors in logs
cat debug.log | grep -i error
```

**Solutions**:

#### Missing Dependencies
```bash
# Reinstall package
npm uninstall -g cohort-mcp-server
npm install -g cohort-mcp-server

# Or use npx (recommended)
npx -y --package=cohort-mcp-server cohort-mcp-server
```

#### Permission Issues
```bash
# Check file permissions
ls -la cohort.config.json
chmod 644 cohort.config.json

# Check directory permissions
ls -la templates/
```

#### Invalid Configuration
```bash
# Validate JSON syntax
python -m json.tool cohort.config.json

# Check for required fields
grep -E "(models|tools)" cohort.config.json
```

---

### 3. API Authentication Errors

**Symptoms**:
- "API key" or "authentication" errors in debug.log
- Tools fail with 401/403 errors
- Circuit breaker state shows authentication failures

**Diagnosis**:
```bash
# Check environment variables
env | grep -E "(ANTHROPIC|GOOGLE|OPENAI|OPENROUTER)_API_KEY"

# Test API key validity
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages \
     -X POST -d '{"model":"claude-3-sonnet-20240229","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
```

**Solutions**:

#### Set Environment Variables
```bash
# In your shell profile (.bashrc, .zshrc, etc.)
export ANTHROPIC_API_KEY="your-key-here"
export GOOGLE_API_KEY="your-key-here"
export OPENAI_API_KEY="your-key-here"
export OPENROUTER_API_KEY="your-key-here"

# Reload shell or restart MCP client
source ~/.bashrc
```

#### MCP Client Configuration
Ensure your MCP client config includes the environment variables:
```json
{
  "mcpServers": {
    "cohort": {
      "command": "npx",
      "args": ["-y", "--package=cohort-mcp-server", "cohort-mcp-server"],
      "env": {
        "ANTHROPIC_API_KEY": "your-key-here",
        "GOOGLE_API_KEY": "your-key-here",
        "OPENAI_API_KEY": "your-key-here",
        "OPENROUTER_API_KEY": "your-key-here"
      }
    }
  }
}
```

#### Verify API Key Format
- **Anthropic**: Starts with `sk-ant-`
- **Google**: Usually starts with `AIza`
- **OpenAI**: Starts with `sk-`
- **OpenRouter**: Usually starts with `sk-or-`

---

### 4. Rate Limiting Issues

**Symptoms**:
- "rate limit" or "quota" errors in debug.log
- Tools respond slowly or fail intermittently
- Circuit breaker opens frequently

**Diagnosis**:
```bash
# Check for rate limit errors
grep -i "rate limit" debug.log
grep -i "quota" debug.log

# Monitor circuit breaker states
grep "Circuit breaker" debug.log
```

**Solutions**:

#### Adjust Retry Configuration
Rate limits are handled automatically with exponential backoff, but you can monitor:
```bash
# Check retry attempts in logs
grep "Retrying" debug.log

# Monitor backoff delays
grep "after.*ms" debug.log
```

#### Use Different Models
Switch high-volume tools to different providers:
```json
{
  "tools": {
    "code_generator": {
      "model": "claude-code",  // CLI model, no API limits
      "description": "...",
      "prompt": "..."
    }
  }
}
```

#### Monitor Usage
```bash
# Track API calls in debug log
grep "Model response" debug.log | wc -l

# Check execution times
grep "completed successfully" debug.log
```

---

### 5. Tool Execution Failures

**Symptoms**:
- Specific tools fail while others work
- "Tool not found" errors
- Model execution errors

**Diagnosis**:
```bash
# Check tool-specific errors
grep "Tool.*failed" debug.log

# Verify tool configuration
python -c "import json; config=json.load(open('cohort.config.json')); print(list(config['tools'].keys()))"

# Check model availability
python -c "import json; config=json.load(open('cohort.config.json')); print(list(config['models'].keys()))"
```

**Solutions**:

#### Missing Tool Configuration
```bash
# Copy complete template
cp templates/cohort.full.template.json ./cohort.config.json

# Verify all tools present
grep -c "\"model\":" cohort.config.json  # Should show 29
```

#### Model Configuration Issues
```bash
# Check model assignments
python -c "
import json
config = json.load(open('cohort.config.json'))
for tool, cfg in config['tools'].items():
    model = cfg['model']
    if model not in config['models']:
        print(f'Tool {tool} references missing model {model}')
"
```

#### CLI Command Issues
```bash
# Test CLI commands manually
claude-code --help
gemini --help

# Check PATH
which claude-code
which gemini
```

---

### 6. Memory System Issues

**Symptoms**:
- Context not preserved between sessions
- Memory-related errors in debug.log
- Inconsistent tool behavior

**Diagnosis**:
```bash
# Check memory initialization
grep "Memory system initialized" debug.log

# Look for memory errors
grep -i "memory.*error" debug.log

# Check memory file permissions
ls -la .cohort-memory/
```

**Solutions**:

#### Reset Memory System
```bash
# Clear memory directory
rm -rf .cohort-memory/

# Restart server to reinitialize
# Memory will be recreated automatically
```

#### Check Disk Space
```bash
# Verify available space
df -h .

# Check memory directory size
du -sh .cohort-memory/
```

---

### 7. Performance Issues

**Symptoms**:
- Slow tool responses
- High iteration counts in debug.log
- Timeout errors

**Diagnosis**:
```bash
# Check execution times
grep "completed successfully.*ms" debug.log

# Monitor iteration counts
grep "iteration.*/" debug.log

# Check for timeouts
grep -i timeout debug.log
```

**Solutions**:

#### Optimize Model Selection
```bash
# Use faster models for performance-critical tools
# CLI models are typically faster than API models
```

#### Monitor Circuit Breaker
```bash
# Check circuit breaker states
grep "Circuit breaker.*OPEN" debug.log

# Reset if needed (restart server)
```

#### Reduce Context Size
```bash
# Limit memory context length in configuration
# Adjust maxContextSummaryLength in memory settings
```

---

## Configuration Debugging

### Validate Configuration File
```bash
# Check JSON syntax
python -m json.tool cohort.config.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Verify required sections
python -c "
import json
config = json.load(open('cohort.config.json'))
required = ['models', 'tools']
missing = [r for r in required if r not in config]
if missing:
    print(f'Missing sections: {missing}')
else:
    print('All required sections present')
"
```

### Check Tool-Model Mappings
```bash
python -c "
import json
config = json.load(open('cohort.config.json'))
errors = []
for tool, cfg in config['tools'].items():
    if 'model' not in cfg:
        errors.append(f'Tool {tool} missing model assignment')
    elif cfg['model'] not in config['models']:
        errors.append(f'Tool {tool} references undefined model {cfg[\"model\"]}')

if errors:
    print('\n'.join(errors))
else:
    print('All tool-model mappings valid')
"
```

### Verify Environment Variables
```bash
python -c "
import json, os
config = json.load(open('cohort.config.json'))
missing_keys = []
for model, cfg in config['models'].items():
    if 'apiKey' in cfg and cfg['apiKey'].startswith('env:'):
        env_var = cfg['apiKey'][4:]  # Remove 'env:' prefix
        if env_var not in os.environ:
            missing_keys.append(f'Model {model} requires {env_var}')

if missing_keys:
    print('\n'.join(missing_keys))
else:
    print('All required environment variables present')
"
```

## Debug Logging

### Enable Verbose Logging
The debug.log file automatically captures:
- Server initialization
- Tool executions
- Model responses
- Error details
- Performance metrics
- Circuit breaker states

### Log Analysis Commands
```bash
# Show recent activity
tail -f debug.log

# Filter by tool
grep "Tool.*code_generator" debug.log

# Show only errors
grep -i error debug.log

# Performance analysis
grep "completed successfully" debug.log | awk '{print $NF}' | sort -n

# Circuit breaker monitoring
grep "Circuit breaker" debug.log | tail -10
```

## Recovery Procedures

### Complete Reset
```bash
# 1. Stop MCP client
# 2. Clear memory and logs
rm -rf .cohort-memory/ debug.log

# 3. Reset configuration
cp templates/cohort.full.template.json ./cohort.config.json

# 4. Verify environment variables
env | grep -E "(ANTHROPIC|GOOGLE|OPENAI)_API_KEY"

# 5. Restart MCP client
```

### Partial Reset
```bash
# Reset memory only
rm -rf .cohort-memory/

# Reset logs only
rm debug.log

# Reset configuration only
cp templates/cohort.full.template.json ./cohort.config.json
```

## Getting Help

### Collect Diagnostic Information
```bash
# Create diagnostic bundle
mkdir cohort-diagnostics
cp cohort.config.json cohort-diagnostics/
cp debug.log cohort-diagnostics/
echo "Environment variables:" > cohort-diagnostics/env.txt
env | grep -E "(COHORT|ANTHROPIC|GOOGLE|OPENAI|OPENROUTER)" >> cohort-diagnostics/env.txt
ls -la templates/ > cohort-diagnostics/templates.txt
tar -czf cohort-diagnostics.tar.gz cohort-diagnostics/
```

### Report Issues
Include the following in bug reports:
1. Cohort version: `npx cohort-mcp-server --version`
2. MCP client type and version
3. Operating system
4. Configuration file (remove API keys)
5. Relevant debug.log entries
6. Steps to reproduce

### Community Resources
- GitHub Issues: Submit detailed bug reports
- Debug logs: Include relevant log excerpts
- Configuration: Share sanitized config files
- Environment: Specify OS and client details