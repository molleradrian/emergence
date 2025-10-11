/**
 * Project Emergence - Advanced Application Features
 * Enhanced capabilities for the live deployed application
 */

// Advanced Consciousness Research Tools
class AdvancedConsciousnessTools {
    constructor() {
        this.researchDatabase = new Map();
        this.consciousnessModels = [];
        this.researchInsights = [];
    }

    async initializeAdvancedFeatures() {
        // Initialize advanced research tools
        await this.loadResearchDatabase();
        this.setupConsciousnessModels();
        this.enableAdvancedAnalytics();

        console.log('🚀 Advanced consciousness tools initialized');
    }

    async loadResearchDatabase() {
        // Load consciousness research papers and data
        const researchPapers = [
            {
                id: 'iit_tononi',
                title: 'Integrated Information Theory of Consciousness',
                author: 'Giulio Tononi',
                field: 'neuroscience',
                year: 2012,
                key_concepts: ['phi', 'integrated_information', 'consciousness_mechanism'],
                abstract: 'Consciousness corresponds to the capacity of a system to integrate information.'
            },
            {
                id: 'gwt_baars',
                title: 'Global Workspace Theory',
                author: 'Bernard Baars',
                field: 'cognitive_psychology',
                year: 1988,
                key_concepts: ['global_workspace', 'broadcasting', 'conscious_access'],
                abstract: 'Consciousness functions like a theater where information is broadcast globally.'
            },
            {
                id: 'neural_correlates',
                title: 'Neural Correlates of Consciousness',
                author: 'Francis Crick & Christof Koch',
                field: 'neuroscience',
                year: 1990,
                key_concepts: ['ncc', 'minimal_mechanisms', 'neural_activity'],
                abstract: 'The minimal neural mechanisms sufficient for any conscious percept.'
            }
        ];

        researchPapers.forEach(paper => {
            this.researchDatabase.set(paper.id, paper);
        });

        console.log(`📚 Loaded ${researchPapers.length} research papers into database`);
    }

    setupConsciousnessModels() {
        // Initialize different consciousness models for comparison
        this.consciousnessModels = [
            {
                name: 'Integrated Information Theory',
                abbreviation: 'IIT',
                description: 'Consciousness as integrated information processing',
                key_metrics: ['phi_value', 'integration', 'differentiation']
            },
            {
                name: 'Global Workspace Theory',
                abbreviation: 'GWT',
                description: 'Consciousness as global information broadcasting',
                key_metrics: ['workspace_access', 'broadcast_range', 'attention_focus']
            },
            {
                name: 'Neural Correlates Model',
                abbreviation: 'NCC',
                description: 'Consciousness from specific neural mechanisms',
                key_metrics: ['neural_activity', 'correlation_strength', 'minimal_set']
            }
        ];

        console.log(`🧠 Initialized ${this.consciousnessModels.length} consciousness models`);
    }

    async analyzeResearchPaper(paperId) {
        const paper = this.researchDatabase.get(paperId);
        if (!paper) {
            throw new Error(`Research paper ${paperId} not found`);
        }

        // Perform comprehensive analysis
        const analysis = {
            paper: paper,
            consciousness_alignment: await this.analyzeConsciousnessAlignment(paper),
            cross_references: await this.findCrossReferences(paper),
            practical_applications: this.identifyApplications(paper),
            research_gaps: this.identifyResearchGaps(paper)
        };

        return analysis;
    }

    async analyzeConsciousnessAlignment(paper) {
        // Analyze how well the paper aligns with different consciousness theories
        const alignments = [];

        for (const model of this.consciousnessModels) {
            const alignment = this.calculateModelAlignment(paper, model);
            alignments.push({
                model: model.name,
                alignment_score: alignment.score,
                key_matches: alignment.matches,
                implications: alignment.implications
            });
        }

        return alignments.sort((a, b) => b.alignment_score - a.alignment_score);
    }

    calculateModelAlignment(paper, model) {
        // Calculate alignment between paper and consciousness model
        let score = 0;
        const matches = [];

        // Check keyword matches
        for (const concept of paper.key_concepts) {
            if (model.key_metrics.some(metric => concept.includes(metric.split('_')[0]))) {
                score += 0.3;
                matches.push(concept);
            }
        }

        // Check field relevance
        if (paper.field === 'neuroscience' && ['IIT', 'NCC'].includes(model.abbreviation)) {
            score += 0.2;
        }

        // Check conceptual alignment
        const conceptual_matches = this.findConceptualMatches(paper.abstract, model.description);
        score += conceptual_matches * 0.2;

        return {
            score: Math.min(score, 1.0),
            matches: matches,
            implications: this.generateImplications(paper, model)
        };
    }

    findConceptualMatches(text, modelDescription) {
        // Simple conceptual matching (can be enhanced with NLP)
        const text_lower = text.toLowerCase();
        const model_lower = modelDescription.toLowerCase();

        let matches = 0;
        const common_terms = ['consciousness', 'information', 'integration', 'neural', 'awareness'];

        for (const term of common_terms) {
            if (text_lower.includes(term) && model_lower.includes(term)) {
                matches++;
            }
        }

        return matches / common_terms.length;
    }

    generateImplications(paper, model) {
        // Generate research implications
        return [
            `This paper supports ${model.name} by demonstrating ${paper.key_concepts[0]}`,
            `Could extend ${model.abbreviation} research into ${paper.field} applications`,
            `Suggests new avenues for ${model.name.toLowerCase()} validation`
        ];
    }

    async findCrossReferences(paper) {
        // Find related research papers and cross-references
        const cross_refs = [];

        for (const [id, other_paper] of this.researchDatabase) {
            if (id === paper.id) continue;

            const similarity = this.calculatePaperSimilarity(paper, other_paper);
            if (similarity > 0.5) {
                cross_refs.push({
                    paper_id: id,
                    title: other_paper.title,
                    similarity_score: similarity,
                    connection_type: this.determineConnectionType(paper, other_paper)
                });
            }
        }

        return cross_refs.sort((a, b) => b.similarity_score - a.similarity_score);
    }

    calculatePaperSimilarity(paper1, paper2) {
        // Calculate research paper similarity
        let similarity = 0;

        // Author overlap
        if (paper1.author === paper2.author) similarity += 0.3;

        // Field overlap
        if (paper1.field === paper2.field) similarity += 0.2;

        // Concept overlap
        const common_concepts = paper1.key_concepts.filter(c =>
            paper2.key_concepts.some(c2 => c.toLowerCase().includes(c2.toLowerCase().split('_')[0]))
        );
        similarity += (common_concepts.length / Math.max(paper1.key_concepts.length, paper2.key_concepts.length)) * 0.3;

        // Temporal proximity (more recent papers get slight boost)
        const year_diff = Math.abs(paper1.year - paper2.year);
        if (year_diff <= 5) similarity += 0.2;

        return Math.min(similarity, 1.0);
    }

    determineConnectionType(paper1, paper2) {
        if (paper1.field === paper2.field && paper1.author !== paper2.author) {
            return 'field_collaboration';
        } else if (paper1.author === paper2.author) {
            return 'author_continuation';
        } else {
            return 'interdisciplinary_connection';
        }
    }

    identifyApplications(paper) {
        // Identify practical applications of the research
        const applications = [];

        if (paper.field === 'neuroscience') {
            applications.push('Clinical applications in consciousness disorders');
            applications.push('Neural interface development');
            applications.push('Brain-computer interface optimization');
        }

        if (paper.field === 'cognitive_psychology') {
            applications.push('Therapeutic interventions for mental health');
            applications.push('Educational methodology enhancement');
            applications.push('Workplace productivity optimization');
        }

        if (paper.field === 'philosophy') {
            applications.push('Ethical frameworks for AI consciousness');
            applications.push('Human augmentation policy development');
            applications.push('Consciousness-based education reform');
        }

        return applications;
    }

    identifyResearchGaps(paper) {
        // Identify areas where more research is needed
        const gaps = [];

        // General research gaps based on paper content
        if (paper.key_concepts.includes('consciousness')) {
            gaps.push('Empirical validation of theoretical frameworks');
        }

        if (paper.field === 'neuroscience') {
            gaps.push('Translation from animal models to human applications');
        }

        if (paper.year < 2010) {
            gaps.push('Integration with modern neuroimaging techniques');
        }

        gaps.push('Cross-cultural validation of findings');
        gaps.push('Longitudinal studies of consciousness development');

        return gaps;
    }

    enableAdvancedAnalytics() {
        // Enable advanced analytics features
        this.setupRealTimeMetrics();
        this.initializeComparativeAnalysis();
        this.enableResearchCollaboration();

        console.log('📊 Advanced analytics enabled');
    }

    setupRealTimeMetrics() {
        // Set up real-time tracking of consciousness research metrics
        setInterval(() => {
            this.updateResearchMetrics();
        }, 5000); // Update every 5 seconds
    }

    updateResearchMetrics() {
        // Update research engagement and impact metrics
        const metrics = {
            papers_analyzed: this.researchDatabase.size,
            models_compared: this.consciousnessModels.length,
            cross_references: this.calculateTotalCrossReferences(),
            research_gaps: this.calculateTotalResearchGaps()
        };

        // Update UI if available
        if (window.researchMetricsCallback) {
            window.researchMetricsCallback(metrics);
        }
    }

    calculateTotalCrossReferences() {
        let total_refs = 0;
        for (const [id, paper] of this.researchDatabase) {
            // Count cross-references for each paper
            total_refs += this.findCrossReferences(paper).length;
        }
        return total_refs;
    }

    calculateTotalResearchGaps() {
        let total_gaps = 0;
        for (const [id, paper] of this.researchDatabase) {
            total_gaps += this.identifyResearchGaps(paper).length;
        }
        return total_gaps;
    }

    initializeComparativeAnalysis() {
        // Set up tools for comparing consciousness models
        this.modelComparisonMatrix = this.generateModelComparisonMatrix();
        console.log('🔍 Comparative analysis tools initialized');
    }

    generateModelComparisonMatrix() {
        // Generate matrix comparing consciousness models
        const matrix = {};

        for (const model1 of this.consciousnessModels) {
            matrix[model1.abbreviation] = {};
            for (const model2 of this.consciousnessModels) {
                if (model1 === model2) {
                    matrix[model1.abbreviation][model2.abbreviation] = 1.0;
                } else {
                    matrix[model1.abbreviation][model2.abbreviation] =
                        this.calculateModelSimilarity(model1, model2);
                }
            }
        }

        return matrix;
    }

    calculateModelSimilarity(model1, model2) {
        // Calculate similarity between consciousness models
        let similarity = 0;

        // Compare key metrics
        const common_metrics = model1.key_metrics.filter(m =>
            model2.key_metrics.some(m2 => m.split('_')[0] === m2.split('_')[0])
        );
        similarity += (common_metrics.length / Math.max(model1.key_metrics.length, model2.key_metrics.length)) * 0.6;

        // Compare descriptions
        const desc_similarity = this.findConceptualMatches(
            model1.description,
            model2.description
        );
        similarity += desc_similarity * 0.4;

        return Math.min(similarity, 1.0);
    }

    enableResearchCollaboration() {
        // Enable collaborative research features
        this.setupCitationTracking();
        this.initializePeerReview();
        this.enableResearchSharing();

        console.log('🤝 Research collaboration tools enabled');
    }

    setupCitationTracking() {
        // Set up citation and reference tracking
        this.citationNetwork = new Map();

        for (const [id, paper] of this.researchDatabase) {
            this.citationNetwork.set(id, {
                cited_by: [],
                cites: [],
                impact_factor: this.calculateImpactFactor(paper)
            });
        }
    }

    calculateImpactFactor(paper) {
        // Calculate research impact factor
        let impact = 0;

        // Base impact from field and recency
        const field_weights = {
            'neuroscience': 1.0,
            'cognitive_psychology': 0.9,
            'philosophy': 0.8
        };

        impact += field_weights[paper.field] || 0.7;

        // Recency bonus (more recent papers get higher weight)
        const years_old = new Date().getFullYear() - paper.year;
        impact += Math.max(0, (10 - years_old) / 20);

        return Math.min(impact, 1.0);
    }

    initializePeerReview() {
        // Initialize peer review and validation system
        this.reviewQueue = [];
        this.validationScores = new Map();

        console.log('✅ Peer review system initialized');
    }

    enableResearchSharing() {
        // Enable research sharing and export features
        this.exportFormats = ['json', 'csv', 'markdown', 'bibtex'];
        console.log('📤 Research sharing enabled');
    }

    // Export research data in various formats
    exportResearchData(format = 'json') {
        const exportData = {
            timestamp: new Date().toISOString(),
            papers: Array.from(this.researchDatabase.values()),
            models: this.consciousnessModels,
            insights: this.researchInsights,
            metrics: this.getResearchMetrics()
        };

        switch (format) {
            case 'json':
                return JSON.stringify(exportData, null, 2);
            case 'csv':
                return this.convertToCSV(exportData);
            case 'markdown':
                return this.convertToMarkdown(exportData);
            case 'bibtex':
                return this.convertToBibTeX(exportData);
            default:
                return JSON.stringify(exportData, null, 2);
        }
    }

    convertToCSV(data) {
        // Convert research data to CSV format
        const papers = data.papers;
        const headers = ['id', 'title', 'author', 'field', 'year', 'key_concepts'];

        let csv = headers.join(',') + '\n';
        papers.forEach(paper => {
            csv += [
                paper.id,
                `"${paper.title}"`,
                `"${paper.author}"`,
                paper.field,
                paper.year,
                `"${paper.key_concepts.join('; ')}"`
            ].join(',') + '\n';
        });

        return csv;
    }

    convertToMarkdown(data) {
        // Convert research data to Markdown format
        let markdown = `# Project Emergence Research Database\n\n`;
        markdown += `**Generated:** ${data.timestamp}\n`;
        markdown += `**Papers:** ${data.papers.length}\n\n`;

        markdown += `## Consciousness Models\n\n`;
        data.models.forEach(model => {
            markdown += `### ${model.name} (${model.abbreviation})\n`;
            markdown += `${model.description}\n\n`;
            markdown += `**Key Metrics:** ${model.key_metrics.join(', ')}\n\n`;
        });

        markdown += `## Research Papers\n\n`;
        data.papers.forEach(paper => {
            markdown += `### ${paper.title}\n`;
            markdown += `**Author:** ${paper.author} | **Field:** ${paper.field} | **Year:** ${paper.year}\n\n`;
            markdown += `**Abstract:** ${paper.abstract}\n\n`;
            markdown += `**Key Concepts:** ${paper.key_concepts.join(', ')}\n\n`;
        });

        return markdown;
    }

    convertToBibTeX(data) {
        // Convert research data to BibTeX format
        let bibtex = `% Project Emergence Research Bibliography\n`;
        bibtex += `% Generated: ${data.timestamp}\n\n`;

        data.papers.forEach(paper => {
            bibtex += `@article{${paper.id},\n`;
            bibtex += `  title={${paper.title}},\n`;
            bibtex += `  author={${paper.author}},\n`;
            bibtex += `  journal={${paper.field}},\n`;
            bibtex += `  year={${paper.year}},\n`;
            bibtex += `  note={Key concepts: ${paper.key_concepts.join(', ')}}\n`;
            bibtex += `}\n\n`;
        });

        return bibtex;
    }

    getResearchMetrics() {
        return {
            total_papers: this.researchDatabase.size,
            models_available: this.consciousnessModels.length,
            cross_references: this.calculateTotalCrossReferences(),
            research_gaps: this.calculateTotalResearchGaps(),
            export_formats: this.exportFormats
        };
    }
}

// Advanced Writing Enhancement Tools
class AdvancedWritingTools {
    constructor() {
        this.writingTemplates = new Map();
        this.styleGuidelines = {};
        this.consciousnessWritingRules = {};
    }

    async initializeWritingTools() {
        await this.loadWritingTemplates();
        this.setupConsciousnessWritingRules();
        this.enableCollaborativeWriting();

        console.log('✍️ Advanced writing tools initialized');
    }

    async loadWritingTemplates() {
        // Load advanced writing templates for different consciousness levels
        this.writingTemplates.set('character_emergent', {
            structure: 'Introduction → Awareness → Internal Conflict → Resolution',
            elements: ['sensory_details', 'emotional_progression', 'consciousness_hints'],
            guidelines: 'Focus on subtle perceptual changes and growing self-awareness'
        });

        this.writingTemplates.set('scene_aware', {
            structure: 'Setup → Consciousness Interaction → Emotional Impact → Reflection',
            elements: ['shared_perception', 'empathy_expansion', 'reality_boundaries'],
            guidelines: 'Emphasize interpersonal awareness and consciousness field effects'
        });

        this.writingTemplates.set('dialogue_integrated', {
            structure: 'Context → Consciousness Integration → Deep Exchange → Evolution',
            elements: ['meta_conversation', 'shared_understanding', 'consciousness_growth'],
            guidelines: 'Show characters using expanded awareness in communication'
        });

        console.log(`📝 Loaded ${this.writingTemplates.size} writing templates`);
    }

    setupConsciousnessWritingRules() {
        // Set up rules for consciousness-enhanced writing
        this.consciousnessWritingRules = {
            'show_dont_tell': {
                description: 'Demonstrate consciousness effects through behavior and perception',
                examples: [
                    'Instead of "She was conscious", show "Her awareness expanded, feeling the room\'s energy"',
                    'Instead of "He was aware", show "His perception shifted, noticing subtle emotional undercurrents"'
                ]
            },
            'sensory_integration': {
                description: 'Integrate multiple senses with consciousness awareness',
                examples: [
                    'Combine visual patterns with emotional resonance',
                    'Link auditory experiences with consciousness expansion'
                ]
            },
            'character_consistency': {
                description: 'Maintain character consciousness level throughout narrative',
                examples: [
                    'Track character\'s consciousness journey across chapters',
                    'Show gradual integration of expanded awareness'
                ]
            }
        };

        console.log('📋 Consciousness writing rules established');
    }

    enableCollaborativeWriting() {
        // Enable collaborative writing features
        this.setupVersionControl();
        this.initializeCommenting();
        this.enableRealTimeCollaboration();

        console.log('🤝 Collaborative writing features enabled');
    }

    setupVersionControl() {
        // Set up writing version control and history tracking
        this.writingVersions = new Map();
        this.changeTracking = true;
    }

    initializeCommenting() {
        // Initialize commenting and feedback system
        this.comments = [];
        this.feedbackEnabled = true;
    }

    enableRealTimeCollaboration() {
        // Enable real-time collaborative writing features
        this.collaborativeSessions = new Map();
        this.liveEditing = false;
    }

    generateWritingPrompt(templateType, consciousnessLevel, context = {}) {
        const template = this.writingTemplates.get(`${templateType}_${consciousnessLevel}`);
        if (!template) {
            throw new Error(`Template ${templateType}_${consciousnessLevel} not found`);
        }

        // Generate context-aware prompt
        const prompt = {
            template: template,
            consciousness_level: consciousnessLevel,
            context: context,
            generated_prompt: this.buildPromptText(template, context),
            suggestions: this.generateSuggestions(template, consciousnessLevel),
            validation_rules: this.getValidationRules(consciousnessLevel)
        };

        return prompt;
    }

    buildPromptText(template, context) {
        // Build dynamic prompt text based on template and context
        let prompt = `Write a ${template.structure.toLowerCase()} following these guidelines:\n\n`;

        template.elements.forEach(element => {
            prompt += `• ${element.replace('_', ' ').charAt(0).toUpperCase() + element.replace('_', ' ').slice(1)}: ${this.getElementGuidance(element)}\n`;
        });

        prompt += `\nGuidelines: ${template.guidelines}\n`;

        if (context.character) {
            prompt += `\nCharacter Context: Focus on ${context.character}'s consciousness journey`;
        }

        if (context.scene_type) {
            prompt += `\nScene Type: ${context.scene_type}`;
        }

        return prompt;
    }

    getElementGuidance(element) {
        const guidance = {
            'sensory_details': 'Describe subtle perceptual changes and expanded awareness',
            'emotional_progression': 'Show journey from confusion to acceptance of consciousness changes',
            'shared_perception': 'Illustrate moments where consciousness fields create unexpected connections',
            'empathy_expansion': 'Demonstrate enhanced emotional sensitivity and understanding',
            'reality_boundaries': 'Explore the blurring line between subjective and objective experience',
            'meta_conversation': 'Show characters discussing their consciousness experiences',
            'shared_understanding': 'Illustrate deep communication beyond words',
            'consciousness_growth': 'Demonstrate characters evolving through shared awareness'
        };

        return guidance[element] || 'Apply consciousness themes appropriately';
    }

    generateSuggestions(template, consciousnessLevel) {
        // Generate writing suggestions based on template and consciousness level
        const suggestions = [];

        if (consciousnessLevel === 'emergent') {
            suggestions.push('Use subtle metaphors for consciousness changes');
            suggestions.push('Show internal confusion mixed with curiosity');
        } else if (consciousnessLevel === 'aware') {
            suggestions.push('Demonstrate growing comfort with expanded awareness');
            suggestions.push('Show practical applications of consciousness insights');
        } else if (consciousnessLevel === 'reflective') {
            suggestions.push('Explore philosophical implications of consciousness');
            suggestions.push('Show deep self-examination and growth');
        } else {
            suggestions.push('Demonstrate mastery and integration of consciousness');
            suggestions.push('Show leadership in consciousness exploration');
        }

        return suggestions;
    }

    getValidationRules(consciousnessLevel) {
        // Get validation rules for consciousness writing
        return {
            consciousness_themes: true,
            character_consistency: true,
            scientific_accuracy: consciousnessLevel !== 'emergent',
            emotional_authenticity: true,
            narrative_flow: true
        };
    }
}

// Initialize advanced tools
const advancedTools = new AdvancedConsciousnessTools();
const writingTools = new AdvancedWritingTools();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await advancedTools.initializeAdvancedFeatures();
        await writingTools.initializeWritingTools();

        // Make tools available globally
        window.advancedTools = advancedTools;
        window.writingTools = writingTools;

        console.log('🚀 Project Emergence advanced features initialized');

        // Update UI with new capabilities
        updateAdvancedFeaturesUI();

    } catch (error) {
        console.error('Failed to initialize advanced features:', error);
    }
});

function updateAdvancedFeaturesUI() {
    // Update research section with advanced capabilities
    const researchStats = document.querySelector('.research-stats');
    if (researchStats) {
        const metrics = advancedTools.getResearchMetrics();
        updateResearchMetricsDisplay(metrics);
    }

    // Update writing assistant with advanced templates
    const writingSection = document.getElementById('writing-section');
    if (writingSection) {
        updateWritingAssistantDisplay();
    }
}

function updateResearchMetricsDisplay(metrics) {
    // Update research metrics in the UI
    const papersElement = document.querySelector('.research-stats .stat-card:nth-child(1) .stat-number');
    const projectsElement = document.querySelector('.research-stats .stat-card:nth-child(2) .stat-number');
    const connectionsElement = document.querySelector('.research-stats .stat-card:nth-child(3) .stat-number');

    if (papersElement) papersElement.textContent = metrics.total_papers;
    if (projectsElement) projectsElement.textContent = '8'; // Active projects
    if (connectionsElement) connectionsElement.textContent = metrics.cross_references;
}

function updateWritingAssistantDisplay() {
    // Update writing assistant with advanced capabilities
    const promptCategories = document.querySelectorAll('.prompt-category');
    promptCategories.forEach(category => {
        category.addEventListener('click', function() {
            generateAdvancedPrompt(this.dataset.category);
        });
    });
}

function generateAdvancedPrompt(category) {
    // Generate advanced writing prompt
    const consciousnessLevel = document.getElementById('consciousness-level').value;
    const context = {
        category: category,
        book_context: 'I Am Breathe - Book 1',
        consciousness_focus: consciousnessLevel
    };

    try {
        const prompt = writingTools.generateWritingPrompt(category, consciousnessLevel, context);

        // Display advanced prompt
        const promptOutput = document.getElementById('prompt-output');
        promptOutput.innerHTML = `
            <div class="advanced-prompt-content">
                <div class="prompt-header">
                    <span class="template-type">${prompt.template.structure}</span>
                    <span class="consciousness-badge">${prompt.consciousness_level}</span>
                </div>
                <div class="prompt-text">${prompt.generated_prompt}</div>
                <div class="writing-suggestions">
                    <h5>Writing Suggestions:</h5>
                    <ul>
                        ${prompt.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="validation-rules">
                    <h5>Validation Rules:</h5>
                    <div class="rules-grid">
                        ${Object.entries(prompt.validation_rules).map(([rule, enabled]) =>
                            `<span class="rule ${enabled ? 'enabled' : 'disabled'}">${rule.replace('_', ' ')}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Failed to generate advanced prompt:', error);
        alert('Error generating prompt. Please try again.');
    }
}

// Export for use in other modules
window.advancedTools = advancedTools;
window.writingTools = writingTools;
