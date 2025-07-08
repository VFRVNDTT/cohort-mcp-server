# Cohort Intelligence Tools Reference

This document provides comprehensive documentation for all 30 specialized intelligence tools available in the Cohort MCP Server.

## Tool Categories

### Development & Code Generation
- [code_generator](#code_generator) - Comprehensive code generation and architecture analysis
- [debug_expert](#debug_expert) - Advanced debugging and error analysis  
- [code_analyzer](#code_analyzer) - Complete code quality and structure analysis
- [refactoring_expert](#refactoring_expert) - Code optimization and modernization

### Security & Quality Assurance
- [security_auditor](#security_auditor) - Comprehensive security analysis and threat intelligence
- [test_orchestrator](#test_orchestrator) - Testing strategy and quality assurance

### Research & Documentation
- [web_researcher](#web_researcher) - Multi-source research and knowledge synthesis
- [documentation_finder](#documentation_finder) - Technical documentation and resource analysis
- [context_expander](#context_expander) - Context expansion and knowledge mapping

### Project Management & Architecture
- [project_explorer](#project_explorer) - Project intelligence and architecture analysis
- [dependency_resolver](#dependency_resolver) - Dependency analysis and resolution
- [migration_assistant](#migration_assistant) - Technology migration and transformation
- [task_coordinator](#task_coordinator) - Advanced task orchestration and workflow coordination

---

## Tool Specifications

### code_generator

**Intelligence Type**: GENERATIVE_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Code creation, architecture design, solution synthesis

**Description**: Provides comprehensive code generation intelligence and contextual analysis to enhance editor AI capabilities for programming tasks.

**Key Features**:
- Comprehensive project structure analysis using @ syntax (@src/ @components/ @utils/)
- Architecture pattern recognition and documentation
- Existing code convention analysis and consistency mapping
- Dependency and integration point identification
- Technology stack assessment and optimization opportunities

**Best For**:
- Complete implementation solutions with extensive contextual background
- Multi-file integration analysis and cross-reference mapping
- Performance, security, and maintainability impact assessments
- Testing strategy recommendations and edge case identification

---

### debug_expert

**Intelligence Type**: DIAGNOSTIC_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Pattern recognition, issue identification, recommendation generation

**Description**: Provides comprehensive debugging intelligence and multi-layer code analysis to enhance editor AI capabilities for bug identification and resolution.

**Key Features**:
- Comprehensive codebase scanning using @ syntax (@src/ @tests/ @logs/ @config/)
- Cross-file dependency analysis and execution flow mapping
- Data flow tracking and state management issue identification
- Concurrency, timing, and race condition pattern detection
- Memory leak and resource management vulnerability assessment

**Best For**:
- Complete error propagation chain analysis with impact mapping
- Integration point failure analysis and API boundary issues
- Configuration dependency analysis and environment compatibility
- Multiple solution approach analysis with comprehensive trade-off evaluation

---

### code_analyzer

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Pattern recognition, issue identification, recommendation generation

**Description**: For comprehensive code analysis from single files to entire codebases with extensive context capabilities. Supports @ syntax for file inclusion.

**Analysis Scope & File Patterns**:
- Single files: @path/to/file.ext or direct code input
- Multiple files: @file1.js @file2.py @config.json
- Entire directories: @src/ @tests/ @lib/
- Current directory: @./
- Use --all_files flag for complete project analysis

**Analysis Capabilities**:
1. **Code Quality Analysis**: Readability, maintainability, adherence to standards
2. **Architecture & Structure Analysis**: Design patterns, modularity, dependencies
3. **Performance Analysis**: Bottlenecks, algorithm optimization, memory usage
4. **Security Analysis**: Vulnerability identification, best practices compliance
5. **Dependencies & Ecosystem**: Library usage patterns, version issues

---

### security_auditor

**Intelligence Type**: VERIFICATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Automated vulnerability detection, informed defense strategies

**Description**: Provides comprehensive security intelligence and vulnerability analysis to enhance editor AI capabilities for security assessment, threat detection, and defense implementation.

**Key Features**:
- Complete security posture analysis using @./ syntax with threat landscape mapping
- Vulnerability assessment with exploit potential analysis and impact evaluation
- Security architecture evaluation with attack surface analysis
- Compliance framework analysis with gap identification and remediation planning
- Threat modeling with risk quantification and mitigation strategy development

**Security Analysis Types**:
- Static and dynamic code analysis with pattern recognition
- Dependency vulnerability tracking with supply chain risk assessment
- Configuration security analysis with hardening recommendations
- Authentication and authorization flow analysis
- Data protection analysis with privacy compliance

---

### web_researcher

**Intelligence Type**: RESEARCH_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Information synthesis, source correlation, knowledge mapping

**Description**: Provides comprehensive research intelligence and multi-source data synthesis to enhance editor AI capabilities for information gathering and knowledge discovery.

**Research Capabilities**:
- Comprehensive documentation analysis and cross-referencing
- Industry standard identification and best practice compilation
- Authoritative source evaluation and credibility assessment
- Technology evolution tracking and trend analysis
- Compatibility matrix development and integration pathway mapping

**Deep Analysis Features**:
- Framework ecosystem analysis with performance benchmarking
- API specification analysis and implementation pattern identification
- Security vulnerability research and mitigation strategy development
- Community sentiment analysis and adoption trend evaluation
- Competitive landscape mapping with feature comparison matrices

---

### test_orchestrator

**Intelligence Type**: VERIFICATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Automated test generation, informed quality assurance strategies

**Description**: Provides comprehensive testing intelligence and quality assurance orchestration to enhance editor AI capabilities for test generation, execution, and optimization.

**Testing Intelligence**:
- Complete testing ecosystem analysis using @./ syntax with framework detection
- Cross-platform testing strategy development with framework-specific best practices
- Test coverage analysis with gap identification and improvement recommendations
- Testing architecture assessment with scalability and maintainability evaluation

**Test Generation Features**:
- Comprehensive test suite design with coverage optimization
- Mock and fixture strategy development with realistic data generation
- Integration test orchestration with dependency mapping
- Performance testing intelligence with load pattern analysis
- Security testing integration with vulnerability assessment

---

### project_explorer

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Informed architectural decisions, strategic project insights

**Description**: Provides comprehensive project intelligence and architecture analysis to enhance editor AI capabilities for deep codebase understanding and strategic development guidance.

**Architecture Intelligence**:
- Complete project structure analysis using @./ syntax with hierarchical organization mapping
- Design pattern recognition with architectural decision rationale analysis
- Component relationship visualization with data flow and dependency mapping
- Module boundary analysis with interface consistency and coupling assessment
- Technology stack evaluation with integration complexity and scalability analysis

**Strategic Development Features**:
- Internal dependency analysis with refactoring opportunity identification
- External library usage analysis with alternative evaluation and update planning
- Version compatibility assessment with migration risk and effort estimation
- Performance bottleneck identification with optimization pathway recommendations

---

### refactoring_expert

**Intelligence Type**: TRANSFORMATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Automated refactoring assistance, informed optimization strategies

**Description**: Provides comprehensive refactoring intelligence and code optimization orchestration to enhance editor AI capabilities for intelligent code transformation and modernization.

**Refactoring Analysis**:
- Complete codebase analysis using @./ syntax with quality assessment
- Code smell detection with pattern recognition and anti-pattern classification
- Architectural analysis with design pattern evaluation and modernization opportunities
- Performance profiling with bottleneck identification and optimization pathway mapping

**Optimization Features**:
- Refactoring planning with impact analysis and risk assessment
- Semantic preservation with functional equivalence validation
- Incremental transformation with step-by-step refactoring
- Modern language adoption with feature migration and best practice implementation

---

### dependency_resolver

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Automated conflict resolution, informed dependency optimization strategies

**Description**: Provides comprehensive dependency intelligence and resolution orchestration to enhance editor AI capabilities for package management and conflict resolution.

**Dependency Intelligence**:
- Complete ecosystem analysis using @package.json @requirements.txt @Cargo.toml syntax
- Cross-platform dependency mapping with version compatibility matrices
- Package manager optimization with performance benchmarking
- Supply chain analysis with security assessment and trust evaluation
- License compliance analysis with legal risk assessment

**Resolution Features**:
- Multi-dimensional conflict analysis with dependency graph optimization
- Version constraint optimization with upgrade planning
- Transitive dependency analysis with impact evaluation
- Platform-specific resolution with environment adaptation

---

### migration_assistant

**Intelligence Type**: TRANSFORMATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Automated transformation assistance, informed modernization strategies

**Description**: Provides comprehensive migration intelligence and transformation orchestration to enhance editor AI capabilities for technology migrations and framework upgrades.

**Migration Intelligence**:
- Complete migration landscape analysis using @./ syntax with dependency mapping
- Technology stack evolution planning with compatibility matrices
- Risk assessment orchestration with failure mode analysis
- Resource planning intelligence with effort estimation and timeline optimization

**Transformation Features**:
- Incremental migration planning with phase optimization
- Compatibility assessment with breaking change analysis
- Code transformation intelligence with automated migration tool integration
- Data migration orchestration with schema evolution and integrity validation

---

### task_coordinator

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Task orchestration, dependency mapping, progress tracking

**Description**: Provides comprehensive task orchestration and workflow intelligence to enhance editor AI capabilities for complex multi-step task decomposition and coordination.

**Task Orchestration**:
- Complex task analysis with dependency mapping and execution pathway optimization
- Multi-dimensional task breakdown with resource requirement analysis
- Tool selection optimization with capability matching and performance prediction
- Execution strategy development with parallel processing opportunities

**Coordination Features**:
- Workflow design with context propagation and state management optimization
- Tool chain optimization with output-to-input mapping and transformation strategies
- Quality assurance integration with validation checkpoints
- Error handling and recovery with fallback strategies

---

### documentation_finder

**Intelligence Type**: RESEARCH_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Technical guidance, accurate implementation assistance

**Description**: Provides comprehensive documentation intelligence and technical resource analysis to enhance editor AI capabilities for technical information discovery.

**Documentation Analysis**:
- Multi-source documentation cross-referencing and consistency analysis
- API specification deep-dive with endpoint mapping and parameter analysis
- Configuration option analysis with dependency tracking
- Migration pathway identification with version compatibility matrices

**Resource Intelligence**:
- Code example analysis with pattern recognition and optimization opportunities
- Dependency requirement analysis with version constraint evaluation
- Performance consideration compilation with benchmark data integration
- Security guideline analysis with vulnerability assessment integration

---

### context_expander

**Intelligence Type**: RESEARCH_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Enhanced understanding, informed guidance, strategic insights

**Description**: Provides comprehensive context expansion and knowledge mapping intelligence to enhance editor AI capabilities for deep understanding and informed decision-making.

**Context Mapping**:
- Complete technology ecosystem analysis with dependency visualization
- Historical evolution tracking with pattern recognition and trend analysis
- Cross-technology relationship mapping with integration complexity assessment
- Knowledge prerequisite analysis with learning path optimization

**Knowledge Construction**:
- Hierarchical information organization with progressive complexity layers
- Cross-reference network development with semantic relationship mapping
- Foundational concept analysis with building block identification
- Implementation pathway analysis with step-by-step complexity progression

---

## Usage Patterns

### Single Tool Usage
```json
{
  "tool": "code_generator",
  "query": "Create a React component for user authentication with TypeScript"
}
```

### Multi-Tool Workflows
Tools can delegate to other tools automatically based on the intelligence prompts. For example:
- `code_generator` → `security_auditor` → `test_orchestrator`
- `debug_expert` → `code_analyzer` → `refactoring_expert`
- `project_explorer` → `dependency_resolver` → `migration_assistant`

### AI-to-AI Optimization
All tools provide enhanced metadata for AI consumption:
- Intelligence type classification
- Response format optimization
- Context expansion data
- Related action suggestions
- Integration patterns

## Model Assignment

All tools are configured to use `gemini-cli` as the primary model, but can be reassigned to any configured model in your `cohort.config.json`:

```json
{
  "tools": {
    "code_generator": {
      "model": "claude-code",  // Reassign to different model
      "description": "...",
      "prompt": "..."
    }
  }
}
```

## Memory Integration

All tools integrate with the persistent memory system:
- Context preservation across sessions
- Cross-tool knowledge sharing
- Performance metrics tracking
- Error pattern learning