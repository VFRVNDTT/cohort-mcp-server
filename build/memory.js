"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryManager = exports.MemoryManager = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const zod_1 = require("zod");
const MODEL_PROFILES = {
    "gemini-cli": {
        contextWindow: 2000000, // 2M tokens - massive context capability
        strengths: ["massive_context", "code_analysis", "research", "multi_format", "comprehensive_analysis"],
        preferredFormats: ["structured_markdown", "detailed_analysis", "comprehensive_context", "technical_deep_dive"],
        responseStyle: "detailed_comprehensive",
        crossModelCompatibility: "universal_provider"
    },
    "claude-code": {
        contextWindow: 200000, // 200K tokens - high quality code focus
        strengths: ["code_generation", "debugging", "technical_writing", "structured_thinking", "practical_solutions"],
        preferredFormats: ["markdown", "code_blocks", "step_by_step", "implementation_focused"],
        responseStyle: "structured_practical",
        crossModelCompatibility: "high_quality_consumer"
    },
    "gpt-4": {
        contextWindow: 128000, // 128K tokens - balanced reasoning
        strengths: ["reasoning", "analysis", "creative_problem_solving", "broad_knowledge", "adaptability"],
        preferredFormats: ["conversational", "bullet_points", "structured_analysis", "creative_solutions"],
        responseStyle: "analytical_balanced",
        crossModelCompatibility: "versatile_consumer"
    },
    "claude-3": {
        contextWindow: 200000, // 200K tokens - thoughtful analysis
        strengths: ["reasoning", "analysis", "careful_thinking", "nuanced_responses", "ethical_considerations"],
        preferredFormats: ["thoughtful_prose", "structured_analysis", "detailed_reasoning", "balanced_perspectives"],
        responseStyle: "thoughtful_comprehensive",
        crossModelCompatibility: "high_quality_consumer"
    },
    "ollama": {
        contextWindow: 32000, // Variable, conservative estimate
        strengths: ["local_processing", "privacy", "customization", "specialized_models"],
        preferredFormats: ["simple_structure", "direct_responses", "focused_output"],
        responseStyle: "efficient_focused",
        crossModelCompatibility: "adaptive_consumer"
    },
    "default": {
        contextWindow: 8000, // Conservative fallback
        strengths: ["general_purpose"],
        preferredFormats: ["simple_text", "basic_structure"],
        responseStyle: "concise_practical",
        crossModelCompatibility: "basic_consumer"
    }
};
// Schema for memory entries
const MemoryEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    timestamp: zod_1.z.number(),
    tool: zod_1.z.string(),
    model: zod_1.z.string(),
    prompt: zod_1.z.string(),
    response: zod_1.z.string(),
    context: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional()
});
const MemorySessionSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    startTime: zod_1.z.number(),
    lastAccessed: zod_1.z.number(),
    entries: zod_1.z.array(MemoryEntrySchema),
    sharedContext: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional()
});
class MemoryManager {
    memoryDir;
    currentSession = null;
    maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    maxMemorySize = 1000; // Max entries per session
    constructor(memoryDir = "./memory") {
        this.memoryDir = memoryDir;
        this.ensureMemoryDir();
    }
    ensureMemoryDir() {
        try {
            if (!(0, fs_1.existsSync)(this.memoryDir)) {
                (0, fs_1.mkdirSync)(this.memoryDir, { recursive: true });
            }
        }
        catch (error) {
            // Fallback to a temporary directory if we can't create the memory directory
            const os = require('os');
            const path = require('path');
            this.memoryDir = path.join(os.tmpdir(), 'cohort-memory');
            if (!(0, fs_1.existsSync)(this.memoryDir)) {
                (0, fs_1.mkdirSync)(this.memoryDir, { recursive: true });
            }
        }
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    getSessionPath(sessionId) {
        return (0, path_1.join)(this.memoryDir, `${sessionId}.json`);
    }
    debugLog(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp}: [Memory] ${message}\n`;
        try {
            (0, fs_1.appendFileSync)("debug.log", logMessage);
        }
        catch (e) {
            // Silently fail if debug logging isn't available
        }
    }
    // Initialize or load a session
    async initializeSession(sessionId) {
        if (sessionId) {
            this.currentSession = await this.loadSession(sessionId);
            this.debugLog(`Loaded existing session: ${sessionId}`);
        }
        else {
            sessionId = this.generateId();
            this.currentSession = {
                sessionId,
                startTime: Date.now(),
                lastAccessed: Date.now(),
                entries: [],
                sharedContext: {}
            };
            this.debugLog(`Created new session: ${sessionId}`);
        }
        return sessionId;
    }
    // Load a session from disk
    async loadSession(sessionId) {
        const sessionPath = this.getSessionPath(sessionId);
        if (!(0, fs_1.existsSync)(sessionPath)) {
            throw new Error(`Session ${sessionId} not found`);
        }
        try {
            const rawData = (0, fs_1.readFileSync)(sessionPath, "utf8");
            const sessionData = JSON.parse(rawData);
            const session = MemorySessionSchema.parse(sessionData);
            // Update last accessed time
            session.lastAccessed = Date.now();
            return session;
        }
        catch (error) {
            throw new Error(`Failed to load session ${sessionId}: ${error instanceof Error ? error.message : error}`);
        }
    }
    // Save current session to disk
    async saveSession() {
        if (!this.currentSession)
            return;
        const sessionPath = this.getSessionPath(this.currentSession.sessionId);
        try {
            (0, fs_1.writeFileSync)(sessionPath, JSON.stringify(this.currentSession, null, 2));
            this.debugLog(`Saved session: ${this.currentSession.sessionId}`);
        }
        catch (error) {
            this.debugLog(`Failed to save session: ${error instanceof Error ? error.message : error}`);
        }
    }
    // Add a memory entry
    async addMemory(tool, model, prompt, response, context, tags, metadata) {
        if (!this.currentSession) {
            throw new Error("No active session. Call initializeSession first.");
        }
        const entry = {
            id: this.generateId(),
            timestamp: Date.now(),
            tool,
            model,
            prompt,
            response,
            context,
            tags,
            metadata
        };
        this.currentSession.entries.push(entry);
        this.currentSession.lastAccessed = Date.now();
        // Trim old entries if we exceed the max size
        if (this.currentSession.entries.length > this.maxMemorySize) {
            this.currentSession.entries = this.currentSession.entries.slice(-this.maxMemorySize);
        }
        await this.saveSession();
        this.debugLog(`Added memory entry: ${entry.id} for tool ${tool}`);
        return entry.id;
    }
    // Get recent memories
    getRecentMemories(count = 10, tool) {
        if (!this.currentSession)
            return [];
        let entries = this.currentSession.entries;
        if (tool) {
            entries = entries.filter(entry => entry.tool === tool);
        }
        return entries.slice(-count).reverse();
    }
    // Search memories by content
    searchMemories(query, tool) {
        if (!this.currentSession)
            return [];
        const searchTerm = query.toLowerCase();
        let entries = this.currentSession.entries;
        if (tool) {
            entries = entries.filter(entry => entry.tool === tool);
        }
        return entries.filter(entry => entry.prompt?.toLowerCase().includes(searchTerm) ||
            entry.response?.toLowerCase().includes(searchTerm) ||
            entry.tags?.some(tag => tag?.toLowerCase().includes(searchTerm)));
    }
    // Get memories by tags
    getMemoriesByTags(tags) {
        if (!this.currentSession)
            return [];
        return this.currentSession.entries.filter(entry => entry.tags?.some(tag => tags.includes(tag)));
    }
    // Update shared context
    updateSharedContext(key, value) {
        if (!this.currentSession)
            return;
        if (!this.currentSession.sharedContext) {
            this.currentSession.sharedContext = {};
        }
        this.currentSession.sharedContext[key] = value;
        this.saveSession();
        this.debugLog(`Updated shared context: ${key}`);
    }
    // Get shared context
    getSharedContext(key) {
        if (!this.currentSession)
            return null;
        if (key) {
            return this.currentSession.sharedContext?.[key];
        }
        return this.currentSession.sharedContext;
    }
    // Enhanced context summary with cross-model intelligence adaptation
    generateContextSummary(tool, maxEntries = 5, targetModel) {
        const recentMemories = this.getRecentMemories(maxEntries, tool);
        if (recentMemories.length === 0) {
            return "No previous context available.";
        }
        // Generate context adapted for target model capabilities
        return this.generateCrossModelContext(tool, recentMemories, targetModel);
    }
    // Generate context optimized for cross-model intelligence transfer
    generateCrossModelContext(currentTool, memories, targetModel) {
        const targetProfile = this.getModelProfile(targetModel);
        const contextSections = [];
        // Analyze source model diversity for cross-model intelligence
        const sourceModels = [...new Set(memories.map(m => m.model))];
        const crossModelTransfer = sourceModels.length > 1;
        // 1. Cross-Model Intelligence Header
        contextSections.push("=== CROSS-MODEL INTELLIGENCE CONTEXT ===");
        contextSections.push(`Target Model: ${targetModel || 'universal'} (${targetProfile.crossModelCompatibility})`);
        contextSections.push(`Current Tool: ${currentTool}`);
        contextSections.push(`Source Models: ${sourceModels.join(', ')}`);
        contextSections.push(`Cross-Model Transfer: ${crossModelTransfer ? 'Active' : 'Single-Model'}`);
        contextSections.push(`Context Window: ${targetProfile.contextWindow.toLocaleString()} tokens`);
        // 2. Model Capability Alignment
        if (crossModelTransfer) {
            contextSections.push("\n=== MODEL CAPABILITY TRANSLATION ===");
            const capabilityMap = this.analyzeCapabilityTransfer(memories, targetProfile);
            contextSections.push(`Intelligence Strengths: ${capabilityMap.alignedStrengths.join(', ')}`);
            contextSections.push(`Format Adaptation: ${capabilityMap.formatAdaptation}`);
            contextSections.push(`Quality Preservation: ${capabilityMap.qualityPreservation}`);
        }
        // 3. Adapted Context Based on Target Model Preferences
        const adaptedContent = this.adaptContextForModel(memories, targetProfile);
        contextSections.push("\n=== ADAPTED INTELLIGENCE CONTENT ===");
        contextSections.push(adaptedContent);
        // 4. Cross-Model Performance Intelligence
        const perfIntelligence = this.generateCrossModelPerformanceIntelligence(memories, targetProfile);
        contextSections.push("\n=== CROSS-MODEL PERFORMANCE INTELLIGENCE ===");
        contextSections.push(perfIntelligence);
        // 5. Model-Specific Recommendations
        const recommendations = this.generateModelSpecificRecommendations(currentTool, targetProfile);
        contextSections.push("\n=== TARGET MODEL OPTIMIZATION RECOMMENDATIONS ===");
        contextSections.push(recommendations);
        return contextSections.join('\n');
    }
    // Get model profile with fallback to default
    getModelProfile(modelName) {
        if (!modelName)
            return MODEL_PROFILES.default;
        return MODEL_PROFILES[modelName] || MODEL_PROFILES.default;
    }
    // Analyze capability transfer between models
    analyzeCapabilityTransfer(memories, targetProfile) {
        const sourceCapabilities = new Set();
        memories.forEach(memory => {
            const sourceProfile = this.getModelProfile(memory.model);
            sourceProfile.strengths.forEach(strength => sourceCapabilities.add(strength));
        });
        const alignedStrengths = targetProfile.strengths.filter(strength => sourceCapabilities.has(strength) || this.isCompatibleCapability(strength, Array.from(sourceCapabilities)));
        return {
            alignedStrengths,
            formatAdaptation: this.determineFormatAdaptation(memories, targetProfile),
            qualityPreservation: this.assessQualityPreservation(memories, targetProfile)
        };
    }
    // Check if capabilities are compatible across models
    isCompatibleCapability(targetCapability, sourceCapabilities) {
        const compatibilityMap = {
            'code_generation': ['code_analysis', 'technical_writing', 'debugging'],
            'reasoning': ['analysis', 'problem_solving', 'careful_thinking'],
            'research': ['broad_knowledge', 'comprehensive_analysis', 'multi_format'],
            'analysis': ['reasoning', 'debugging', 'careful_thinking']
        };
        return compatibilityMap[targetCapability]?.some(compat => sourceCapabilities.includes(compat)) || false;
    }
    // Determine optimal format adaptation strategy
    determineFormatAdaptation(memories, targetProfile) {
        const responseComplexity = memories.reduce((sum, m) => sum + m.response.length, 0) / memories.length;
        if (responseComplexity > 2000 && targetProfile.contextWindow < 50000) {
            return "COMPRESSION_REQUIRED";
        }
        else if (targetProfile.preferredFormats.includes("structured_markdown")) {
            return "MARKDOWN_OPTIMIZATION";
        }
        else if (targetProfile.preferredFormats.includes("simple_structure")) {
            return "SIMPLIFICATION_REQUIRED";
        }
        else {
            return "DIRECT_TRANSFER";
        }
    }
    // Assess quality preservation across model transfer
    assessQualityPreservation(memories, targetProfile) {
        const successRate = memories.filter(m => m.metadata?.circuitBreakerState === 'CLOSED').length / memories.length;
        if (successRate > 0.9 && targetProfile.crossModelCompatibility === 'universal_provider') {
            return "HIGH_FIDELITY";
        }
        else if (successRate > 0.7 && targetProfile.crossModelCompatibility.includes('high_quality')) {
            return "GOOD_PRESERVATION";
        }
        else {
            return "ADAPTIVE_OPTIMIZATION";
        }
    }
    // Adapt context content for specific model capabilities
    adaptContextForModel(memories, targetProfile) {
        const adaptedSections = [];
        for (const memory of memories) {
            const sourceProfile = this.getModelProfile(memory.model);
            // Cross-model intelligence section
            adaptedSections.push(`\n[${memory.tool}] ${sourceProfile.responseStyle} → ${targetProfile.responseStyle}`);
            // Adapt content based on target model preferences
            if (targetProfile.preferredFormats.includes("structured_analysis")) {
                adaptedSections.push(`**Analysis**: ${this.truncateIntelligently(memory.response, 300)}`);
                adaptedSections.push(`**Context**: ${this.truncateIntelligently(memory.prompt, 150)}`);
            }
            else if (targetProfile.preferredFormats.includes("simple_structure")) {
                adaptedSections.push(`Task: ${this.truncateIntelligently(memory.prompt, 100)}`);
                adaptedSections.push(`Result: ${this.truncateIntelligently(memory.response, 150)}`);
            }
            else {
                // Default detailed format
                adaptedSections.push(`Query: ${this.truncateIntelligently(memory.prompt, 200)}`);
                adaptedSections.push(`Intelligence: ${this.truncateIntelligently(memory.response, 400)}`);
            }
            // Add cross-model compatibility indicators
            if (sourceProfile.crossModelCompatibility !== targetProfile.crossModelCompatibility) {
                adaptedSections.push(`Transfer Quality: ${this.assessTransferQuality(sourceProfile, targetProfile)}`);
            }
        }
        return adaptedSections.join('\n');
    }
    // Generate cross-model performance intelligence
    generateCrossModelPerformanceIntelligence(memories, targetProfile) {
        const perfSections = [];
        const modelPerformance = this.analyzeModelPerformance(memories);
        perfSections.push(`Source Model Performance: ${JSON.stringify(modelPerformance, null, 2)}`);
        const contextEfficiency = this.calculateContextEfficiency(memories, targetProfile);
        perfSections.push(`Context Transfer Efficiency: ${contextEfficiency}%`);
        const compatibilityScore = this.calculateCompatibilityScore(memories, targetProfile);
        perfSections.push(`Cross-Model Compatibility Score: ${compatibilityScore}/100`);
        return perfSections.join('\n');
    }
    // Generate model-specific optimization recommendations
    generateModelSpecificRecommendations(tool, targetProfile) {
        const recommendations = [];
        // Tool-specific recommendations based on target model strengths
        if (targetProfile.strengths.includes("massive_context")) {
            recommendations.push(`✓ Leverage massive context window for comprehensive analysis`);
            recommendations.push(`✓ Provide detailed background information and extensive context`);
        }
        if (targetProfile.strengths.includes("code_generation")) {
            recommendations.push(`✓ Focus on implementation-ready code and practical solutions`);
            recommendations.push(`✓ Include code examples and step-by-step implementation`);
        }
        if (targetProfile.strengths.includes("reasoning")) {
            recommendations.push(`✓ Emphasize logical analysis and reasoning chains`);
            recommendations.push(`✓ Provide multiple perspectives and analytical depth`);
        }
        // Format-specific recommendations
        if (targetProfile.preferredFormats.includes("structured_markdown")) {
            recommendations.push(`✓ Use markdown formatting with clear hierarchical structure`);
        }
        if (targetProfile.responseStyle === "concise_practical") {
            recommendations.push(`✓ Keep responses focused and actionable`);
            recommendations.push(`✓ Prioritize essential information over comprehensive detail`);
        }
        return recommendations.join('\n');
    }
    // Assess transfer quality between models
    assessTransferQuality(sourceProfile, targetProfile) {
        const strengthOverlap = sourceProfile.strengths.filter(s => targetProfile.strengths.includes(s)).length;
        const formatCompatibility = sourceProfile.preferredFormats.some(f => targetProfile.preferredFormats.includes(f));
        if (strengthOverlap >= 3 && formatCompatibility) {
            return "HIGH_FIDELITY_TRANSFER";
        }
        else if (strengthOverlap >= 2) {
            return "GOOD_TRANSFER_WITH_ADAPTATION";
        }
        else {
            return "REQUIRES_SIGNIFICANT_ADAPTATION";
        }
    }
    // Analyze performance across different models
    analyzeModelPerformance(memories) {
        const modelStats = {};
        memories.forEach(memory => {
            if (!modelStats[memory.model]) {
                modelStats[memory.model] = {
                    count: 0,
                    avgDuration: 0,
                    successRate: 0,
                    durations: []
                };
            }
            modelStats[memory.model].count++;
            if (memory.metadata?.duration) {
                modelStats[memory.model].durations.push(memory.metadata.duration);
            }
        });
        // Calculate averages
        Object.keys(modelStats).forEach(model => {
            const stats = modelStats[model];
            stats.avgDuration = stats.durations.length > 0
                ? Math.round(stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length)
                : 0;
        });
        return modelStats;
    }
    // Calculate context transfer efficiency
    calculateContextEfficiency(memories, targetProfile) {
        const totalTokens = memories.reduce((sum, m) => sum + m.prompt.length + m.response.length, 0);
        const efficiency = Math.min(100, (targetProfile.contextWindow / totalTokens) * 100);
        return Math.round(efficiency);
    }
    // Calculate compatibility score between source and target models
    calculateCompatibilityScore(memories, targetProfile) {
        let totalScore = 0;
        let scoreCount = 0;
        memories.forEach(memory => {
            const sourceProfile = this.getModelProfile(memory.model);
            // Strength compatibility (40% weight)
            const strengthScore = (sourceProfile.strengths.filter(s => targetProfile.strengths.includes(s)).length / Math.max(sourceProfile.strengths.length, targetProfile.strengths.length)) * 40;
            // Format compatibility (30% weight)
            const formatScore = sourceProfile.preferredFormats.some(f => targetProfile.preferredFormats.includes(f)) ? 30 : 15;
            // Context window compatibility (30% weight)
            const contextScore = Math.min(30, (targetProfile.contextWindow /
                (memory.prompt.length + memory.response.length)) * 10);
            totalScore += strengthScore + formatScore + contextScore;
            scoreCount++;
        });
        return scoreCount > 0 ? Math.round(totalScore / scoreCount) : 50;
    }
    // Generate expanded context with maximum background information
    generateExpandedContext(currentTool, memories) {
        const contextSections = [];
        // 1. Session Overview Section
        contextSections.push("=== SESSION INTELLIGENCE CONTEXT ===");
        contextSections.push(`Current Tool: ${currentTool}`);
        contextSections.push(`Session ID: ${this.currentSession?.sessionId || 'unknown'}`);
        contextSections.push(`Memory Entries: ${this.currentSession?.entries.length || 0}`);
        contextSections.push(`Session Duration: ${this.getSessionDuration()}`);
        // 2. Tool Usage Patterns
        const toolUsageMap = this.analyzeToolUsagePatterns();
        if (Object.keys(toolUsageMap).length > 0) {
            contextSections.push("\n=== TOOL USAGE INTELLIGENCE ===");
            const sortedTools = Object.entries(toolUsageMap)
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 5);
            for (const [tool, stats] of sortedTools) {
                contextSections.push(`${tool}: ${stats.count} uses, avg duration: ${stats.avgDuration}ms`);
            }
        }
        // 3. Recent Interaction Intelligence
        contextSections.push("\n=== RECENT INTERACTION INTELLIGENCE ===");
        for (const memory of memories) {
            const duration = memory.metadata?.duration || 'unknown';
            const iterations = memory.metadata?.iterations || 'unknown';
            contextSections.push(`\n[${memory.tool}] (${duration}ms, ${iterations} iterations)`);
            contextSections.push(`Query: ${this.truncateIntelligently(memory.prompt, 150)}`);
            contextSections.push(`Outcome: ${this.truncateIntelligently(memory.response, 200)}`);
            // Add execution context if available
            if (memory.metadata?.circuitBreakerState) {
                contextSections.push(`Status: ${memory.metadata.circuitBreakerState}`);
            }
        }
        // 4. Cross-Tool Relationships
        const relationships = this.analyzeToolRelationships(memories);
        if (relationships.length > 0) {
            contextSections.push("\n=== TOOL RELATIONSHIP INTELLIGENCE ===");
            relationships.forEach(rel => {
                contextSections.push(`${rel.fromTool} → ${rel.toTool}: ${rel.relationship}`);
            });
        }
        // 5. Shared Context Intelligence
        const sharedContext = this.getSharedContext();
        if (sharedContext && Object.keys(sharedContext).length > 0) {
            contextSections.push("\n=== SHARED CONTEXT INTELLIGENCE ===");
            for (const [key, value] of Object.entries(sharedContext)) {
                const valueStr = typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value);
                contextSections.push(`${key}: ${this.truncateIntelligently(valueStr, 200)}`);
            }
        }
        // 6. Performance Intelligence
        const perfMetrics = this.calculatePerformanceMetrics(memories);
        contextSections.push("\n=== PERFORMANCE INTELLIGENCE ===");
        contextSections.push(`Average Response Time: ${perfMetrics.avgResponseTime}ms`);
        contextSections.push(`Success Rate: ${perfMetrics.successRate}%`);
        contextSections.push(`Iteration Efficiency: ${perfMetrics.avgIterations} iterations`);
        return contextSections.join('\n');
    }
    // Intelligent truncation that preserves meaning
    truncateIntelligently(text, maxLength) {
        if (text.length <= maxLength)
            return text;
        // Try to find a natural break point (sentence, clause, etc.)
        const truncated = text.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf('.');
        const lastClause = truncated.lastIndexOf(',');
        const lastSpace = truncated.lastIndexOf(' ');
        let breakPoint = maxLength;
        if (lastSentence > maxLength * 0.7) {
            breakPoint = lastSentence + 1;
        }
        else if (lastClause > maxLength * 0.8) {
            breakPoint = lastClause + 1;
        }
        else if (lastSpace > maxLength * 0.9) {
            breakPoint = lastSpace;
        }
        return text.substring(0, breakPoint) + (breakPoint < text.length ? "..." : "");
    }
    // Analyze tool usage patterns for intelligence
    analyzeToolUsagePatterns() {
        const patterns = {};
        if (!this.currentSession)
            return {};
        for (const entry of this.currentSession.entries) {
            if (!patterns[entry.tool]) {
                patterns[entry.tool] = { durations: [], count: 0, avgDuration: 0 };
            }
            patterns[entry.tool].count++;
            if (entry.metadata?.duration) {
                patterns[entry.tool].durations.push(entry.metadata.duration);
            }
        }
        // Calculate averages
        for (const tool of Object.keys(patterns)) {
            const durations = patterns[tool].durations;
            patterns[tool].avgDuration = durations.length > 0
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : 0;
        }
        return patterns;
    }
    // Analyze relationships between tools
    analyzeToolRelationships(memories) {
        const relationships = [];
        for (let i = 0; i < memories.length - 1; i++) {
            const current = memories[i];
            const next = memories[i + 1];
            if (current.tool !== next.tool) {
                relationships.push({
                    fromTool: current.tool,
                    toTool: next.tool,
                    relationship: this.determineRelationship(current, next)
                });
            }
        }
        return relationships;
    }
    // Determine relationship type between tools
    determineRelationship(from, to) {
        const fromTool = from.tool?.toLowerCase() || '';
        const toTool = to.tool?.toLowerCase() || '';
        if (fromTool.includes('code') && toTool.includes('debug')) {
            return "code_analysis_flow";
        }
        else if (fromTool.includes('debug') && toTool.includes('refactor')) {
            return "bug_fix_optimization";
        }
        else if (fromTool.includes('security') && toTool.includes('deploy')) {
            return "security_validation_pipeline";
        }
        else if (fromTool.includes('design') && toTool.includes('code')) {
            return "design_to_implementation";
        }
        else if (Math.abs(from.timestamp - to.timestamp) < 5 * 60 * 1000) {
            return "sequential_workflow";
        }
        else {
            return "collaborative_intelligence";
        }
    }
    // Calculate performance metrics
    calculatePerformanceMetrics(memories) {
        const durations = memories
            .map(m => m.metadata?.duration)
            .filter(d => d !== undefined);
        const iterations = memories
            .map(m => m.metadata?.iterations)
            .filter(i => i !== undefined);
        const successfulExecutions = memories
            .filter(m => m.metadata?.circuitBreakerState === 'CLOSED').length;
        return {
            avgResponseTime: durations.length > 0
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : 0,
            successRate: memories.length > 0
                ? Math.round((successfulExecutions / memories.length) * 100)
                : 0,
            avgIterations: iterations.length > 0
                ? Math.round((iterations.reduce((a, b) => a + b, 0) / iterations.length) * 10) / 10
                : 0
        };
    }
    // Get session duration in human-readable format
    getSessionDuration() {
        if (!this.currentSession || this.currentSession.entries.length === 0) {
            return "0 minutes";
        }
        const firstEntry = this.currentSession.entries[0];
        const durationMs = Date.now() - firstEntry.timestamp;
        const minutes = Math.floor(durationMs / (1000 * 60));
        if (minutes < 1)
            return "< 1 minute";
        if (minutes < 60)
            return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
    // Clean up old sessions
    async cleanupOldSessions() {
        // Implementation for cleaning up old session files
        // This would scan the memory directory and remove old sessions
        this.debugLog("Cleaning up old sessions...");
    }
    // Get current session info
    getCurrentSessionInfo() {
        if (!this.currentSession)
            return null;
        return {
            sessionId: this.currentSession.sessionId,
            entryCount: this.currentSession.entries.length,
            startTime: this.currentSession.startTime
        };
    }
}
exports.MemoryManager = MemoryManager;
// Global memory manager instance
exports.memoryManager = new MemoryManager();
