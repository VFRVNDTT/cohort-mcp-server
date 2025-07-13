# Cohort Intelligence Tools Reference

This document provides comprehensive documentation for all 30 specialized intelligence tools available in the Cohort MCP Server.

## Quick Reference Table

| Tool | Type | Primary Use | Example Query |
|------|------|-------------|---------------|
| `code_generator` | GENERATIVE | Code creation, architecture | "Create a React authentication component" |
| `debug_expert` | DIAGNOSTIC | Bug identification, analysis | "Analyze memory leak in @src/components/" |
| `code_analyzer` | ANALYTICAL | Code quality, structure review | "Review @./ for security vulnerabilities" |
| `security_auditor` | VERIFICATION | Security analysis, compliance | "Audit authentication flow for threats" |
| `web_researcher` | RESEARCH | Information gathering, trends | "Research GraphQL vs REST performance 2024" |
| `test_orchestrator` | VERIFICATION | Test strategy, automation | "Design test suite for microservices API" |
| `project_explorer` | ANALYTICAL | Architecture analysis | "Map dependencies in @./ project structure" |
| `refactoring_expert` | TRANSFORMATION | Code optimization | "Refactor legacy @src/utils/ for modern JS" |
| `dependency_resolver` | ANALYTICAL | Package management | "Resolve version conflicts in package.json" |
| `migration_assistant` | TRANSFORMATION | Technology upgrades | "Plan migration from Vue 2 to Vue 3" |

*See full specifications below for all 30 tools*

## Intelligence Types Explained

- **GENERATIVE_INTELLIGENCE**: Creates new code, architectures, and solutions
- **ANALYTICAL_INTELLIGENCE**: Analyzes existing code, patterns, and structures  
- **RESEARCH_INTELLIGENCE**: Gathers information, synthesizes knowledge
- **DIAGNOSTIC_INTELLIGENCE**: Identifies problems, debugs issues
- **COORDINATION_INTELLIGENCE**: Orchestrates tasks, manages workflows
- **TRANSFORMATION_INTELLIGENCE**: Refactors, migrates, modernizes code
- **VERIFICATION_INTELLIGENCE**: Tests, validates, ensures quality
- **DOCUMENTATION_INTELLIGENCE**: Creates docs, explains concepts

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
- [decision_recorder](#decision_recorder) - Architectural decision management

### DevOps & Infrastructure
- [deployment_coordinator](#deployment_coordinator) - Deployment and DevOps orchestration
- [infrastructure_analyzer](#infrastructure_analyzer) - Infrastructure analysis and optimization
- [pipeline_optimizer](#pipeline_optimizer) - CI/CD pipeline optimization

### Advanced Systems & Design
- [ui_architect](#ui_architect) - UI/UX architecture and design systems
- [data_engineer](#data_engineer) - Data engineering and analytics architecture
- [system_designer](#system_designer) - System architecture and distributed systems design
- [consensus_builder](#consensus_builder) - Multi-perspective consensus building
- [workflow_orchestrator](#workflow_orchestrator) - Advanced workflow orchestration

### Intelligence & Management
- [context_manager](#context_manager) - Context intelligence and information management
- [memory_system](#memory_system) - Memory management and knowledge persistence
- [pattern_detector](#pattern_detector) - Pattern recognition and trend analysis
- [mcp_tool_manager](#mcp_tool_manager) - MCP ecosystem and tool orchestration
- [plugin_system](#plugin_system) - Plugin architecture and extensible systems
- [api_gateway](#api_gateway) - API gateway and service mesh architecture

### Documentation & Content
- [documentation_architect](#documentation_architect) - Documentation architecture and content strategy
- [technical_writer](#technical_writer) - Technical writing and content creation

---

## Tool Specifications

### code_generator

**Intelligence Type**: GENERATIVE_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Code creation, architecture design, solution synthesis

**Description**: Provides comprehensive code generation intelligence and contextual analysis to enhance CLI AI capabilities for programming tasks.

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

**Description**: Provides comprehensive debugging intelligence and multi-layer code analysis to enhance CLI AI capabilities for bug identification and resolution.

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

**Description**: Provides comprehensive security intelligence and vulnerability analysis to enhance CLI AI capabilities for security assessment, threat detection, and defense implementation.

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

**Description**: Provides comprehensive research intelligence and multi-source data synthesis to enhance CLI AI capabilities for information gathering and knowledge discovery.

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

**Description**: Provides comprehensive testing intelligence and quality assurance orchestration to enhance CLI AI capabilities for test generation, execution, and optimization.

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

**Description**: Provides comprehensive project intelligence and architecture analysis to enhance CLI AI capabilities for deep codebase understanding and strategic development guidance.

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

**Description**: Provides comprehensive refactoring intelligence and code optimization orchestration to enhance CLI AI capabilities for intelligent code transformation and modernization.

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

**Description**: Provides comprehensive dependency intelligence and resolution orchestration to enhance CLI AI capabilities for package management and conflict resolution.

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

**Description**: Provides comprehensive migration intelligence and transformation orchestration to enhance CLI AI capabilities for technology migrations and framework upgrades.

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

**Description**: Provides comprehensive task orchestration and workflow intelligence to enhance CLI AI capabilities for complex multi-step task decomposition and coordination.

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

**Description**: Provides comprehensive documentation intelligence and technical resource analysis to enhance CLI AI capabilities for technical information discovery.

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

**Description**: Provides comprehensive context expansion and knowledge mapping intelligence to enhance CLI AI capabilities for deep understanding and informed decision-making.

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

### consensus_builder

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Multi-perspective synthesis, decision-making, conflict resolution

**Description**: Provides comprehensive consensus intelligence and multi-perspective synthesis to enhance CLI AI capabilities for decision-making, conflict resolution, and optimal solution development.

**Key Features**:
- Complete perspective aggregation with expertise weighting and relevance scoring
- Conflict identification with root cause analysis and resolution pathway mapping
- Evidence evaluation with credibility assessment and supporting argument validation
- Stakeholder impact analysis with need balancing and priority optimization
- Decision framework development with criteria establishment

**Best For**:
- Compromise solution development with win-win scenario identification
- Alternative pathway analysis with contingency planning
- Complex multi-stakeholder decision scenarios
- Technical architecture consensus building

**Example Usage**:
```json
{
  "tool": "consensus_builder",
  "query": "Build consensus on microservices vs monolith architecture for our team, considering scalability, maintenance, and team expertise"
}
```

---

### workflow_orchestrator

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Multi-model coordination, workflow design, execution management

**Description**: Provides comprehensive workflow intelligence and multi-model orchestration to enhance CLI AI capabilities for complex workflow design and execution management.

**Key Features**:
- Complete workflow architecture analysis with pattern recognition
- Multi-model collaboration with capability matching and task distribution
- Data flow orchestration with context propagation and transformation
- Dynamic adaptation with real-time optimization and pathway adjustment
- Performance monitoring with execution analytics

**Best For**:
- Multi-tool workflow design and coordination
- Complex automation pipeline development
- Resource allocation and performance optimization
- Cross-team collaboration workflows

**Example Usage**:
```json
{
  "tool": "workflow_orchestrator", 
  "query": "Design workflow for automated code review process involving security scan, quality check, and deployment approval"
}
```

---

### deployment_coordinator

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: DevOps orchestration, infrastructure management, release coordination

**Description**: Provides comprehensive deployment intelligence and DevOps orchestration to enhance CLI AI capabilities for deployment planning and infrastructure management.

**Key Features**:
- Complete deployment strategy analysis with infrastructure assessment
- Multi-environment orchestration with configuration management
- CI/CD pipeline intelligence with automation optimization
- Risk assessment with rollback planning and disaster recovery
- Security integration with scanning automation

**Best For**:
- Multi-cloud deployment strategies
- Container orchestration and Kubernetes optimization
- Release management and rollback procedures
- Infrastructure as Code implementation

**Example Usage**:
```json
{
  "tool": "deployment_coordinator",
  "query": "Plan blue-green deployment strategy for Node.js microservices on AWS with zero-downtime requirements"
}
```

---

### infrastructure_analyzer

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Cloud optimization, performance tuning, infrastructure planning

**Description**: Provides comprehensive infrastructure intelligence and architecture analysis to enhance CLI AI capabilities for cloud optimization and infrastructure planning.

**Key Features**:
- Complete infrastructure assessment with configuration analysis
- Multi-cloud strategy development with vendor analysis
- Container orchestration analysis with Kubernetes optimization
- Performance analysis with resource utilization assessment
- Cost optimization with resource rightsizing

**Best For**:
- Infrastructure cost optimization
- Performance bottleneck identification
- Security hardening and compliance validation
- Migration planning and modernization

**Example Usage**:
```json
{
  "tool": "infrastructure_analyzer",
  "query": "Analyze current AWS infrastructure for cost optimization opportunities and performance improvements"
}
```

---

### pipeline_optimizer

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: CI/CD optimization, build automation, workflow efficiency

**Description**: Provides comprehensive CI/CD intelligence and pipeline optimization to enhance CLI AI capabilities for build automation and development productivity.

**Key Features**:
- Complete pipeline analysis with bottleneck identification
- Build process optimization with parallelization strategies
- Testing strategy enhancement with pyramid optimization
- Quality gate implementation with security scanning
- GitOps and progressive delivery optimization

**Best For**:
- Build time optimization and caching strategies
- Test execution efficiency and parallelization
- Deployment automation and release management
- Developer experience improvements

**Example Usage**:
```json
{
  "tool": "pipeline_optimizer",
  "query": "Optimize GitHub Actions pipeline for faster builds and better caching strategy for React application"
}
```

---

### documentation_architect

**Intelligence Type**: DOCUMENTATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Information design, content strategy, knowledge management

**Description**: Provides comprehensive documentation intelligence and content architecture to enhance CLI AI capabilities for information design and knowledge management.

**Key Features**:
- Complete documentation analysis with content assessment
- Information architecture development with user journey mapping
- Multi-audience strategy with content personalization
- Content lifecycle management with versioning strategy
- Platform integration with tool evaluation

**Best For**:
- Documentation site architecture and organization
- Content strategy and user experience optimization
- Multi-format content development
- Knowledge management systems

**Example Usage**:
```json
{
  "tool": "documentation_architect",
  "query": "Design documentation architecture for API platform with developer onboarding and reference materials"
}
```

---

### technical_writer

**Intelligence Type**: DOCUMENTATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Content creation, technical communication, educational materials

**Description**: Provides comprehensive technical writing intelligence and content creation to enhance CLI AI capabilities for documentation and technical communication.

**Key Features**:
- Complete content analysis with structure assessment
- Audience-specific writing with personalization strategies
- Multi-format content development with platform adaptation
- Technical accuracy enhancement with validation protocols
- Visual communication with diagram generation

**Best For**:
- API documentation and developer guides
- Tutorial and educational content creation
- Technical specification writing
- User manual and help system development

**Example Usage**:
```json
{
  "tool": "technical_writer",
  "query": "Write comprehensive API documentation for REST endpoints with authentication examples and error handling"
}
```

---

### decision_recorder

**Intelligence Type**: DOCUMENTATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Decision documentation, rationale capture, organizational knowledge

**Description**: Provides comprehensive decision intelligence and architectural decision management to enhance CLI AI capabilities for decision documentation and organizational knowledge.

**Key Features**:
- Complete decision analysis with context assessment
- Architecture Decision Record (ADR) development
- Stakeholder perspective integration with consensus building
- Decision dependency mapping with relationship analysis
- Historical decision tracking with pattern recognition

**Best For**:
- Architectural Decision Records (ADRs)
- Technical decision documentation
- Team consensus building and rationale capture
- Organizational knowledge management

**Example Usage**:
```json
{
  "tool": "decision_recorder",
  "query": "Create ADR for choosing PostgreSQL over MongoDB for user data storage with trade-off analysis"
}
```

---

### ui_architect

**Intelligence Type**: GENERATIVE_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Interface design, user experience optimization, frontend development

**Description**: Provides comprehensive UI/UX intelligence and design system architecture to enhance CLI AI capabilities for interface design and user experience optimization.

**Key Features**:
- Complete UI/UX analysis with design pattern assessment
- Design system architecture with component hierarchy
- User experience optimization with journey mapping
- Accessibility integration with inclusive design
- Performance optimization with loading strategy

**Best For**:
- Design system architecture and component libraries
- User interface optimization and accessibility
- Frontend architecture and state management
- Cross-platform design consistency

**Example Usage**:
```json
{
  "tool": "ui_architect",
  "query": "Design component library architecture for React application with accessibility and mobile responsiveness"
}
```

---

### data_engineer

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Data pipeline architecture, analytics systems, machine learning infrastructure

**Description**: Provides comprehensive data intelligence and pipeline architecture to enhance CLI AI capabilities for data engineering and analytics systems.

**Key Features**:
- Complete data architecture analysis with pipeline assessment
- Data governance framework with quality management
- Technology stack optimization with tool evaluation
- ETL/ELT optimization with processing strategy
- Real-time analytics with stream processing

**Best For**:
- Data pipeline design and optimization
- Analytics platform architecture
- Machine learning infrastructure and MLOps
- Data governance and quality management

**Example Usage**:
```json
{
  "tool": "data_engineer",
  "query": "Design real-time analytics pipeline for e-commerce platform with Apache Kafka and Apache Spark"
}
```

---

### system_designer

**Intelligence Type**: GENERATIVE_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: System architecture, distributed systems design, scalable solutions

**Description**: Provides comprehensive system architecture intelligence and distributed systems design to enhance CLI AI capabilities for scalable software solutions.

**Key Features**:
- Complete system analysis with architecture assessment
- Distributed systems design with consistency models
- Scalability strategy development with performance optimization
- Integration architecture with communication patterns
- Security architecture with zero-trust design

**Best For**:
- Microservices architecture and service decomposition
- Event-driven design and asynchronous processing
- Serverless architecture and container orchestration
- High-availability and fault-tolerant systems

**Example Usage**:
```json
{
  "tool": "system_designer",
  "query": "Design distributed system architecture for real-time chat application with horizontal scaling and fault tolerance"
}
```

---

### context_manager

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Context intelligence, adaptive information management, conversation continuity

**Description**: Provides comprehensive context intelligence and adaptive information management to enhance CLI AI capabilities for conversation continuity and knowledge organization.

**Key Features**:
- Complete context analysis with information hierarchy
- Conversation continuity with session management
- Adaptive processing with dynamic filtering
- Cross-tool coordination with context sharing
- Multi-modal context handling with correlation

**Best For**:
- Long-form conversation management
- Cross-session context preservation
- Multi-tool workflow coordination
- Intelligent information filtering

**Example Usage**:
```json
{
  "tool": "context_manager",
  "query": "Manage context flow for complex debugging session across multiple tools and code analysis phases"
}
```

---

### memory_system

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Knowledge persistence, intelligent retrieval, adaptive learning

**Description**: Provides comprehensive memory intelligence and knowledge persistence to enhance CLI AI capabilities for information retention and intelligent retrieval.

**Key Features**:
- Complete memory analysis with architecture assessment
- Intelligent memory management with adaptive allocation
- Knowledge persistence with cross-session continuity
- Advanced retrieval with semantic search
- Hierarchical memory organization with domain structuring

**Best For**:
- Cross-session knowledge retention
- Intelligent information retrieval
- Learning pattern recognition
- Knowledge base management

**Example Usage**:
```json
{
  "tool": "memory_system",
  "query": "Analyze memory architecture for optimal storage and retrieval of project-specific development patterns"
}
```

---

### pattern_detector

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Pattern recognition, anomaly detection, insight generation

**Description**: Provides comprehensive pattern intelligence and trend analysis to enhance CLI AI capabilities for pattern recognition and insight generation.

**Key Features**:
- Complete pattern analysis with code structure identification
- Data pattern recognition with statistical analysis
- Behavioral pattern detection with interaction analysis
- System pattern analysis with infrastructure recognition
- Cross-domain correlation with relationship discovery

**Best For**:
- Code pattern analysis and anti-pattern detection
- Performance pattern identification
- Security vulnerability pattern recognition
- User behavior and system usage analysis

**Example Usage**:
```json
{
  "tool": "pattern_detector",
  "query": "Analyze codebase for recurring patterns, anti-patterns, and optimization opportunities across @src/ directory"
}
```

---

### mcp_tool_manager

**Intelligence Type**: COORDINATION_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: MCP ecosystem management, tool orchestration, workflow automation

**Description**: Provides comprehensive MCP ecosystem intelligence and tool orchestration to enhance CLI AI capabilities for Model Context Protocol management and tool discovery.

**Key Features**:
- Complete MCP analysis with tool landscape assessment
- Tool discovery and registry with automated indexing
- Installation and configuration with dependency resolution
- Orchestration and coordination with workflow composition
- Ecosystem management with lifecycle tracking

**Best For**:
- MCP server configuration and optimization
- Tool discovery and integration
- Workflow composition and automation
- Ecosystem monitoring and management

**Example Usage**:
```json
{
  "tool": "mcp_tool_manager",
  "query": "Optimize MCP tool configuration for development workflow with code analysis, security, and testing tools"
}
```

---

### plugin_system

**Intelligence Type**: GENERATIVE_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: Plugin architecture, extensible system design, ecosystem management

**Description**: Provides comprehensive plugin architecture intelligence and extensible system design to enhance CLI AI capabilities for modular development and dynamic loading.

**Key Features**:
- Complete plugin architecture analysis with extensibility assessment
- Dynamic loading system design with hot-pluggable capabilities
- Plugin ecosystem architecture with marketplace development
- Security and isolation framework with sandboxing protocols
- Modular architecture patterns with interface design

**Best For**:
- Plugin system architecture and design
- Extensible application frameworks
- Dynamic module loading and management
- Community-driven ecosystem development

**Example Usage**:
```json
{
  "tool": "plugin_system",
  "query": "Design plugin architecture for IDE extension system with secure sandboxing and API versioning"
}
```

---

### api_gateway

**Intelligence Type**: ANALYTICAL_INTELLIGENCE  
**Primary Model**: gemini-cli  
**Capabilities**: API management, service mesh architecture, microservices integration

**Description**: Provides comprehensive API gateway intelligence and service mesh architecture to enhance CLI AI capabilities for API management and traffic orchestration.

**Key Features**:
- Complete API gateway analysis with traffic pattern assessment
- Service mesh architecture with sidecar proxy integration
- Traffic management orchestration with load balancing
- Security framework integration with authentication protocols
- API lifecycle orchestration with versioning strategies

**Best For**:
- API gateway configuration and optimization
- Service mesh architecture and management
- Microservices communication patterns
- API security and traffic management

**Example Usage**:
```json
{
  "tool": "api_gateway",
  "query": "Design API gateway architecture for microservices platform with authentication, rate limiting, and monitoring"
}
```

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