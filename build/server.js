"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const config_1 = require("./config");
const models_1 = require("./models");
const memory_1 = require("./memory");
const zod_1 = require("zod");
const fs_1 = require("fs");
const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
};
// Editor-optimized response templates for different AI capabilities
function createEditorOptimizedResponse(content, metadata) {
    const intelligenceType = determineIntelligenceType(metadata.toolName, {
        model: '',
        description: metadata.toolName || '',
        prompt: ''
    });
    // Enhanced response templates based on editor AI capabilities
    const responseTemplates = {
        GENERATIVE_INTELLIGENCE: {
            format: "structured_content",
            capabilities: ["code_generation", "architecture_design", "solution_synthesis"],
            optimization: "implementation_ready"
        },
        ANALYTICAL_INTELLIGENCE: {
            format: "detailed_analysis",
            capabilities: ["pattern_recognition", "issue_identification", "recommendation_generation"],
            optimization: "insight_rich"
        },
        RESEARCH_INTELLIGENCE: {
            format: "comprehensive_data",
            capabilities: ["information_synthesis", "source_correlation", "knowledge_mapping"],
            optimization: "context_expanded"
        },
        COORDINATION_INTELLIGENCE: {
            format: "workflow_structured",
            capabilities: ["task_orchestration", "dependency_mapping", "progress_tracking"],
            optimization: "action_oriented"
        },
        STRATEGIC_INTELLIGENCE: {
            format: "decision_framework",
            capabilities: ["strategic_analysis", "option_evaluation", "impact_assessment"],
            optimization: "executive_ready"
        }
    };
    const template = responseTemplates[intelligenceType] || responseTemplates.ANALYTICAL_INTELLIGENCE;
    return {
        content: [{
                type: "text",
                text: content
            }],
        // Rich metadata optimized for editor AI consumption
        metadata: {
            ...metadata,
            intelligenceType,
            responseTemplate: template,
            editorOptimizations: {
                format: template.format,
                capabilities: template.capabilities,
                optimization: template.optimization,
                contextExpansion: generateContextExpansion(metadata),
                relatedActions: generateRelatedActions(metadata.toolName, metadata.contextMetadata?.relatedTools || []),
                confidenceMetrics: {
                    executionSuccess: metadata.executionContext.circuitBreakerState === 'CLOSED',
                    iterationEfficiency: metadata.executionContext.iterations <= 2,
                    contextRelevance: metadata.contextMetadata?.hasContextSummary || false
                }
            },
            aiConsumptionHints: {
                primaryUseCase: getPrimaryUseCase(intelligenceType),
                followUpSuggestions: getFollowUpSuggestions(metadata.toolName),
                integrationPatterns: getIntegrationPatterns(intelligenceType)
            }
        }
    };
}
// Enhanced context expansion with maximum background information
function generateContextExpansion(metadata) {
    return {
        technicalContext: {
            modelProvider: metadata.provider,
            executionEnvironment: "MCP_SERVER",
            toolArchitecture: "AI_TO_AI_OPTIMIZED",
            performanceProfile: {
                executionTime: metadata.executionContext.duration,
                iterationCount: metadata.executionContext.iterations,
                efficiency: metadata.executionContext.iterations <= 2 ? "HIGH" : "MODERATE"
            }
        },
        domainContext: {
            toolCategory: categorizeToolByName(metadata.toolName),
            expertiseLevel: "ENTERPRISE_GRADE",
            integrationCapabilities: ["MCP_PROTOCOL", "MULTI_EDITOR", "CROSS_PLATFORM"],
            qualityAssurance: "PRODUCTION_READY"
        },
        operationalContext: {
            sessionContinuity: metadata.contextMetadata?.hasContextSummary,
            memoryPersistence: true,
            collaborationReady: true,
            scalabilityProfile: "HIGH_THROUGHPUT"
        }
    };
}
// Generate related actions for editor AI guidance
function generateRelatedActions(toolName, relatedTools) {
    const actionMap = {
        code_generator: ["debug_expert", "test_orchestrator", "security_auditor"],
        debug_expert: ["code_analyzer", "refactoring_expert", "test_orchestrator"],
        security_auditor: ["refactoring_expert", "dependency_resolver", "infrastructure_analyzer"],
        deployment_coordinator: ["infrastructure_analyzer", "pipeline_optimizer", "security_auditor"],
        ui_architect: ["code_generator", "test_orchestrator", "pattern_detector"],
        data_engineer: ["system_designer", "pattern_detector", "infrastructure_analyzer"]
    };
    const suggested = actionMap[toolName] || relatedTools.slice(0, 3);
    return suggested.map(tool => ({
        toolName: tool,
        actionType: "FOLLOW_UP",
        rationale: `Complementary ${categorizeToolByName(tool)} intelligence`,
        priority: relatedTools.includes(tool) ? "HIGH" : "MEDIUM"
    }));
}
// Determine primary use case for AI consumption optimization
function getPrimaryUseCase(intelligenceType) {
    const useCaseMap = {
        GENERATIVE_INTELLIGENCE: "CODE_CREATION_AND_ARCHITECTURE",
        ANALYTICAL_INTELLIGENCE: "PROBLEM_SOLVING_AND_OPTIMIZATION",
        RESEARCH_INTELLIGENCE: "KNOWLEDGE_DISCOVERY_AND_SYNTHESIS",
        COORDINATION_INTELLIGENCE: "WORKFLOW_MANAGEMENT_AND_ORCHESTRATION",
        STRATEGIC_INTELLIGENCE: "DECISION_SUPPORT_AND_PLANNING"
    };
    return useCaseMap[intelligenceType] || "GENERAL_INTELLIGENCE_SUPPORT";
}
// Generate follow-up suggestions for editor AI
function getFollowUpSuggestions(toolName) {
    const suggestionMap = {
        code_generator: ["Run tests to validate generated code", "Review security implications", "Optimize performance"],
        debug_expert: ["Implement recommended fixes", "Add unit tests for edge cases", "Document solution"],
        security_auditor: ["Apply security recommendations", "Update dependencies", "Implement monitoring"],
        deployment_coordinator: ["Monitor deployment metrics", "Set up alerting", "Plan rollback strategy"]
    };
    return suggestionMap[toolName] || ["Review output", "Consider implementation", "Plan next steps"];
}
// Get integration patterns for different intelligence types
function getIntegrationPatterns(intelligenceType) {
    const patternMap = {
        GENERATIVE_INTELLIGENCE: ["DIRECT_IMPLEMENTATION", "TEMPLATE_EXPANSION", "ITERATIVE_REFINEMENT"],
        ANALYTICAL_INTELLIGENCE: ["INSIGHT_INTEGRATION", "RECOMMENDATION_PIPELINE", "DECISION_SUPPORT"],
        RESEARCH_INTELLIGENCE: ["KNOWLEDGE_AUGMENTATION", "CONTEXT_ENRICHMENT", "REFERENCE_EXPANSION"],
        COORDINATION_INTELLIGENCE: ["WORKFLOW_ORCHESTRATION", "TASK_DELEGATION", "PROGRESS_TRACKING"],
        STRATEGIC_INTELLIGENCE: ["PLANNING_INTEGRATION", "OPTION_EVALUATION", "IMPACT_ANALYSIS"]
    };
    return patternMap[intelligenceType] || ["GENERAL_INTEGRATION"];
}
// Categorize tool by name for context
function categorizeToolByName(toolName) {
    if (toolName.includes('code') || toolName.includes('debug') || toolName.includes('refactor')) {
        return "DEVELOPMENT";
    }
    else if (toolName.includes('deploy') || toolName.includes('infrastructure') || toolName.includes('pipeline')) {
        return "DEVOPS";
    }
    else if (toolName.includes('security') || toolName.includes('audit')) {
        return "SECURITY";
    }
    else if (toolName.includes('ui') || toolName.includes('design')) {
        return "DESIGN";
    }
    else if (toolName.includes('data') || toolName.includes('pattern')) {
        return "ANALYTICS";
    }
    else if (toolName.includes('task') || toolName.includes('workflow') || toolName.includes('consensus')) {
        return "COORDINATION";
    }
    else if (toolName.includes('research') || toolName.includes('documentation') || toolName.includes('context')) {
        return "RESEARCH";
    }
    return "GENERAL";
}
// Circuit breaker for error handling
class CircuitBreaker {
    failureThreshold;
    resetTimeout;
    failures = 0;
    lastFailureTime = 0;
    state = 'CLOSED';
    constructor(failureThreshold = 5, resetTimeout = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
    }
    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
            }
            else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    getState() {
        return { state: this.state, failures: this.failures };
    }
}
// Global circuit breaker instances
const modelCircuitBreakers = new Map();
// Enhanced error classification
function classifyError(error) {
    const message = error?.message || error?.toString() || '';
    if (message.includes('API key') || message.includes('authentication') || message.includes('unauthorized')) {
        return { type: 'AUTH', retryable: false, severity: 'HIGH' };
    }
    if (message.includes('rate limit') || message.includes('quota') || message.includes('throttled')) {
        return { type: 'RATE_LIMIT', retryable: true, severity: 'MEDIUM' };
    }
    if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
        return { type: 'NETWORK', retryable: true, severity: 'MEDIUM' };
    }
    if (message.includes('model') || message.includes('invalid request') || message.includes('bad request')) {
        return { type: 'MODEL', retryable: false, severity: 'MEDIUM' };
    }
    if (message.includes('configuration') || message.includes('config')) {
        return { type: 'CONFIG', retryable: false, severity: 'HIGH' };
    }
    return { type: 'UNKNOWN', retryable: true, severity: 'MEDIUM' };
}
// Enhanced retry mechanism with exponential backoff
async function executeWithRetry(fn, config = DEFAULT_RETRY_CONFIG, context = 'operation') {
    let lastError;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                const delay = Math.min(config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1), config.maxDelay);
                debugLog(`Retrying ${context} after ${delay}ms (attempt ${attempt}/${config.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            return await fn();
        }
        catch (error) {
            lastError = error;
            const errorInfo = classifyError(error);
            debugLog(`${context} failed on attempt ${attempt + 1}: ${error instanceof Error ? error.message : error}`);
            debugLog(`Error type: ${errorInfo.type}, Retryable: ${errorInfo.retryable}, Severity: ${errorInfo.severity}`);
            // Don't retry non-retryable errors
            if (!errorInfo.retryable || attempt === config.maxRetries) {
                break;
            }
        }
    }
    throw lastError;
}
const ToolCallSchema = zod_1.z.object({
    tool: zod_1.z.string(),
    query: zod_1.z.string()
});
function debugLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    try {
        (0, fs_1.appendFileSync)("debug.log", logMessage);
    }
    catch (e) {
        // Silently fail if debug logging isn't available
    }
}
// Determine the intelligence type for AI consumption optimization
function determineIntelligenceType(toolName, toolConfig) {
    const name = toolName?.toLowerCase() || '';
    const description = toolConfig?.description?.toLowerCase() || '';
    // Categorize tools by their intelligence type for AI optimization
    if (name.includes('generator') || name.includes('architect') || name.includes('designer')) {
        return 'GENERATIVE_INTELLIGENCE';
    }
    if (name.includes('analyzer') || name.includes('auditor') || name.includes('explorer')) {
        return 'ANALYTICAL_INTELLIGENCE';
    }
    if (name.includes('researcher') || name.includes('finder') || name.includes('expander')) {
        return 'RESEARCH_INTELLIGENCE';
    }
    if (name.includes('debug') || name.includes('resolver') || name.includes('expert')) {
        return 'DIAGNOSTIC_INTELLIGENCE';
    }
    if (name.includes('coordinator') || name.includes('orchestrator') || name.includes('manager')) {
        return 'COORDINATION_INTELLIGENCE';
    }
    if (name.includes('migration') || name.includes('refactor') || name.includes('optimizer')) {
        return 'TRANSFORMATION_INTELLIGENCE';
    }
    if (name.includes('test') || name.includes('security') || name.includes('validator')) {
        return 'VERIFICATION_INTELLIGENCE';
    }
    if (name.includes('writer') || name.includes('documentation') || name.includes('decision')) {
        return 'DOCUMENTATION_INTELLIGENCE';
    }
    return 'GENERAL_INTELLIGENCE';
}
function createToolHandler(toolName, configGetter) {
    return async (args) => {
        const { query } = args;
        const startTime = Date.now();
        debugLog(`Tool '${toolName}' called with query: ${query}`);
        try {
            // Get circuit breaker for this tool
            if (!modelCircuitBreakers.has(toolName)) {
                modelCircuitBreakers.set(toolName, new CircuitBreaker());
            }
            const circuitBreaker = modelCircuitBreakers.get(toolName);
            return await circuitBreaker.execute(async () => {
                return await executeWithRetry(async () => {
                    // Get current config (may have been reloaded)
                    const config = configGetter();
                    const currentToolConfig = config.tools[toolName];
                    if (!currentToolConfig) {
                        throw new Error(`Configuration for tool '${toolName}' not found.`);
                    }
                    // Get primary model config and prepare fallback models
                    const primaryModelId = currentToolConfig.model;
                    const fallbackModelIds = currentToolConfig.fallbackModels || [];
                    const allModelIds = [primaryModelId, ...fallbackModelIds];
                    // Validate all model configs exist
                    const modelConfigs = [];
                    for (const modelId of allModelIds) {
                        const modelConfig = config.models[modelId];
                        if (!modelConfig) {
                            if (modelId === primaryModelId) {
                                throw new Error(`Primary model '${modelId}' for tool '${toolName}' not found.`);
                            }
                            debugLog(`Warning: Fallback model '${modelId}' for tool '${toolName}' not found, skipping.`);
                            continue;
                        }
                        modelConfigs.push({ id: modelId, config: modelConfig });
                    }
                    if (modelConfigs.length === 0) {
                        throw new Error(`No valid models found for tool '${toolName}'.`);
                    }
                    const fallbackConfig = config.fallback;
                    const fallbackEnabled = fallbackConfig?.enabled !== false;
                    const maxFallbackAttempts = fallbackConfig?.maxAttempts || 3;
                    // Generate context summary with cross-model intelligence adaptation
                    const contextSummary = memory_1.memoryManager.generateContextSummary(toolName, 5, currentToolConfig.model);
                    let conversation = [
                        { role: "system", content: (0, models_1.buildToolPrompt)(currentToolConfig, config.tools, contextSummary) },
                        { role: "user", content: query }
                    ];
                    let finalResponse = "";
                    let maxIterations = 5;
                    let iterationCount = 0;
                    let successfulModelId = "";
                    while (maxIterations-- > 0) {
                        iterationCount++;
                        // Try primary model and fallbacks
                        let modelResponse = "";
                        let lastError = null;
                        for (let attemptIndex = 0; attemptIndex < modelConfigs.length && attemptIndex < maxFallbackAttempts; attemptIndex++) {
                            const { id: modelId, config: modelConfig } = modelConfigs[attemptIndex];
                            const isFirstAttempt = attemptIndex === 0;
                            const isFallback = !isFirstAttempt;
                            try {
                                if (isFallback && !fallbackEnabled) {
                                    throw new Error("Fallback models disabled in configuration");
                                }
                                // Check circuit breaker for this specific model (unless configured to skip)
                                if (isFallback && !fallbackConfig?.skipCircuitBreaker) {
                                    const modelCircuitBreaker = modelCircuitBreakers.get(`${toolName}-${modelId}`);
                                    if (modelCircuitBreaker?.getState().state === 'OPEN') {
                                        debugLog(`Skipping fallback model ${modelId} due to open circuit breaker`);
                                        continue;
                                    }
                                }
                                debugLog(`${isFallback ? 'Fallback' : 'Primary'} model attempt ${attemptIndex + 1}: ${modelId}`);
                                modelResponse = await executeWithRetry(() => (0, models_1.executeModel)(modelConfig, conversation.map(m => `${m.role}: ${m.content}`).join("\n\n")), DEFAULT_RETRY_CONFIG, `${toolName} ${isFallback ? 'fallback' : 'primary'} model execution (${modelId}, iteration ${iterationCount})`);
                                successfulModelId = modelId;
                                if (isFallback) {
                                    debugLog(`Fallback model ${modelId} succeeded after primary model failure`);
                                }
                                break; // Success, exit the fallback loop
                            }
                            catch (error) {
                                lastError = error;
                                const errorType = classifyError(error);
                                debugLog(`${isFallback ? 'Fallback' : 'Primary'} model ${modelId} failed: ${lastError.message}`);
                                // Don't try fallbacks for certain error types
                                if (errorType.type === 'AUTH' || errorType.type === 'CONFIG') {
                                    debugLog(`Not attempting fallbacks due to ${errorType.type} error`);
                                    break;
                                }
                                // Continue to next fallback model if available
                                if (attemptIndex < modelConfigs.length - 1 && attemptIndex < maxFallbackAttempts - 1) {
                                    continue;
                                }
                            }
                        }
                        // If all models failed, throw the last error
                        if (!modelResponse && lastError) {
                            throw lastError;
                        }
                        debugLog(`Model response (iteration ${iterationCount}): ${modelResponse.substring(0, 200)}...`);
                        try {
                            const toolCall = ToolCallSchema.parse(JSON.parse(modelResponse));
                            const subToolConfig = config.tools[toolCall.tool];
                            if (!subToolConfig)
                                throw new Error(`Sub-tool '${toolCall.tool}' not found`);
                            const subToolModelConfig = config.models[subToolConfig.model];
                            if (!subToolModelConfig)
                                throw new Error(`Model for sub-tool '${toolCall.tool}' not found`);
                            const toolResponse = await executeWithRetry(() => (0, models_1.executeModel)(subToolModelConfig, `${subToolConfig.prompt}\n\n${toolCall.query}`), DEFAULT_RETRY_CONFIG, `Sub-tool ${toolCall.tool} execution`);
                            conversation.push({ role: "assistant", content: modelResponse }, { role: "user", content: `Tool result for '${toolCall.tool}': ${toolResponse}` });
                        }
                        catch (e) {
                            finalResponse = modelResponse;
                            break;
                        }
                    }
                    if (!finalResponse) {
                        throw new Error("Max tool call iterations reached without final response");
                    }
                    // Store the successful interaction in memory
                    const duration = Date.now() - startTime;
                    await memory_1.memoryManager.addMemory(toolName, currentToolConfig.model, query, finalResponse, {
                        contextSummary,
                        duration,
                        iterations: iterationCount,
                        circuitBreakerState: circuitBreaker.getState()
                    }, [toolName, successfulModelId || currentToolConfig.model], { timestamp: Date.now() });
                    debugLog(`Tool '${toolName}' completed successfully in ${duration}ms with ${iterationCount} iterations`);
                    // Enhanced AI-to-AI response format with cross-model optimization
                    const enhancedResponse = createEditorOptimizedResponse(finalResponse, {
                        toolName,
                        model: successfulModelId || currentToolConfig.model,
                        provider: (successfulModelId ? modelConfigs.find(m => m.id === successfulModelId)?.config.provider : modelConfigs[0]?.config.provider) || 'unknown',
                        executionContext: {
                            duration,
                            iterations: iterationCount,
                            timestamp: Date.now(),
                            circuitBreakerState: circuitBreaker.getState()
                        },
                        contextMetadata: {
                            hasContextSummary: contextSummary && contextSummary.trim() !== "No previous context available.",
                            contextSummary: contextSummary,
                            relatedTools: Object.keys(config.tools).filter(name => name !== toolName && config.tools[name].description.toLowerCase().includes(currentToolConfig.description.toLowerCase().split(' ')[0])),
                            crossModelCompatible: true,
                            sourceModel: currentToolConfig.model,
                            universalFormat: true
                        }
                    });
                    // Validate JSON response structure before returning
                    try {
                        JSON.stringify(enhancedResponse);
                    }
                    catch (jsonError) {
                        debugLog(`JSON validation failed for response: ${jsonError}`);
                        // Return simplified response if JSON is invalid
                        return {
                            content: [{ type: "text", text: finalResponse }],
                            metadata: { toolName, model: successfulModelId || currentToolConfig.model }
                        };
                    }
                    return enhancedResponse;
                }, DEFAULT_RETRY_CONFIG, `Tool ${toolName} execution`);
            });
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorInfo = classifyError(error);
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            debugLog(`Tool '${toolName}' failed after ${duration}ms: ${message}`);
            debugLog(`Error classification: ${JSON.stringify(errorInfo)}`);
            // Enhanced error response with recovery suggestions
            let errorResponse = `Error: ${message}`;
            // Add recovery suggestions based on error type
            switch (errorInfo.type) {
                case 'AUTH':
                    errorResponse += "\n\nRecovery suggestion: Please check your API keys and authentication configuration.";
                    break;
                case 'RATE_LIMIT':
                    errorResponse += "\n\nRecovery suggestion: Rate limit exceeded. Please wait a moment before retrying.";
                    break;
                case 'NETWORK':
                    errorResponse += "\n\nRecovery suggestion: Network connectivity issue. Please check your internet connection and try again.";
                    break;
                case 'CONFIG':
                    errorResponse += "\n\nRecovery suggestion: Configuration error detected. Please check your cohort.config.json file.";
                    break;
                case 'MODEL':
                    errorResponse += "\n\nRecovery suggestion: Model execution error. Please verify your request format and model availability.";
                    break;
                default:
                    if (errorInfo.retryable) {
                        errorResponse += "\n\nRecovery suggestion: This appears to be a temporary issue. Please try again.";
                    }
            }
            // Store error in memory with enhanced metadata
            try {
                const config = configGetter();
                const toolConfig = config.tools[toolName];
                const circuitBreaker = modelCircuitBreakers.get(toolName);
                await memory_1.memoryManager.addMemory(toolName, toolConfig?.model || "unknown", query, `Error: ${message}`, {
                    error: true,
                    errorType: errorInfo.type,
                    errorSeverity: errorInfo.severity,
                    retryable: errorInfo.retryable,
                    duration,
                    circuitBreakerState: circuitBreaker?.getState()
                }, [toolName, "error", errorInfo.type], { timestamp: Date.now() });
            }
            catch (memoryError) {
                debugLog(`Failed to store error in memory: ${memoryError}`);
            }
            return {
                content: [{ type: "text", text: errorResponse }],
                isError: true,
                metadata: {
                    toolName,
                    model: "unknown",
                    provider: "unknown",
                    executionContext: {
                        duration,
                        iterations: 0,
                        timestamp: Date.now(),
                        circuitBreakerState: modelCircuitBreakers.get(toolName)?.getState()
                    },
                    error: {
                        type: errorInfo.type,
                        severity: errorInfo.severity,
                        retryable: errorInfo.retryable,
                        classification: errorInfo
                    },
                    aiOptimized: true
                }
            };
        }
    };
}
// Global configuration manager instance
let configManager = null;
let registeredTools = new Set();
async function startServer() {
    debugLog("Server initializing...");
    const server = new mcp_js_1.McpServer({
        name: "cohort",
        version: "0.1.0"
    }, {
        capabilities: {
            tools: {}
        }
    });
    try {
        // Initialize memory system
        await memory_1.memoryManager.initializeSession();
        debugLog("Memory system initialized");
        // Initialize configuration manager
        configManager = new config_1.ConfigManager((0, config_1.getConfigPath)());
        debugLog("Configuration manager initialized");
        // Register an empty prompts capability (tools-only server)
        // No prompts to register - this is a tools-focused MCP server
        // Register tools initially
        await registerTools(server, configManager.getConfig());
        // Setup configuration reload handler
        configManager.on('configReloaded', async ({ oldConfig, newConfig }) => {
            debugLog("Configuration reloaded, updating tools...");
            await registerTools(server, newConfig);
        });
        configManager.on('configError', (error) => {
            debugLog(`Configuration error: ${error instanceof Error ? error.message : error}`);
        });
        // Graceful shutdown handler
        process.on('SIGTERM', () => {
            debugLog("Received SIGTERM, shutting down gracefully...");
            if (configManager) {
                configManager.destroy();
            }
            process.exit(0);
        });
        process.on('SIGINT', () => {
            debugLog("Received SIGINT, shutting down gracefully...");
            if (configManager) {
                configManager.destroy();
            }
            process.exit(0);
        });
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        debugLog("Connection established, running on stdio");
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        const stack = err instanceof Error ? err.stack : "";
        console.error(`Cohort Server: Failed to start server: ${message}`);
        console.error(`Cohort Server: Stack trace: ${stack}`);
        debugLog(`Failed to start server: ${message}\nStack: ${stack}`);
        process.exit(1);
    }
}
// Register tools with the server
async function registerTools(server, config) {
    try {
        // Note: MCP doesn't support dynamic tool registration/unregistration
        // So we'll register tools only once and use the current config in handlers
        for (const toolName in config.tools) {
            if (!registeredTools.has(toolName)) {
                const toolConfig = config.tools[toolName];
                debugLog(`Registering tool: ${toolName} with description: ${toolConfig.description}`);
                server.tool(toolName, { query: zod_1.z.string().describe(toolConfig.description) }, createToolHandler(toolName, () => configManager?.getConfig() || config));
                registeredTools.add(toolName);
                debugLog(`Successfully registered tool: ${toolName}`);
            }
        }
    }
    catch (error) {
        debugLog(`Error registering tools: ${error instanceof Error ? error.message : error}`);
    }
}
