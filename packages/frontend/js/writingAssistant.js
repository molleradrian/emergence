// Writing Assistant Module - Integrates consciousness analysis with creative writing

class WritingAssistant {
    constructor() {
        this.consciousnessEngine = window.consciousnessEngine; // Reference to consciousness system
        this.userSettings = window.userSettingsManager; // Reference to user settings
        this.bookContent = {}; // Loaded book content
        this.lastAnalysis = null;
    }

    // Initialize with book content
    async loadBookContent(bookId = 'book1') {
        try {
            // In a real implementation, this would fetch from your book repository
            // For now, we'll use sample content
            this.bookContent = {
                chapters: [
                    { id: 1, title: "The Awakening", content: "Aria felt the first stirrings of consciousness..." },
                    { id: 2, title: "Shadow Work", content: "Michael confronted his deepest fears in the mirror..." },
                    // ... other chapters
                ],
                characters: [
                    { name: "Aria Chen", traits: ["curious", "analytical", "empathetic"], arc: "awakening" },
                    { name: "Michael Torres", traits: ["introspective", "courageous", "healer"], arc: "shadow integration" }
                ],
                themes: ["consciousness evolution", "quantum entanglement", "shadow integration"]
            };
            return true;
        } catch (error) {
            console.error('Error loading book content:', error);
            return false;
        }
    }

    // Generate writing suggestions based on current context
    async generateSuggestions(userInput, context = {}) {
        const consciousnessAnalysis = await this.analyzeWithConsciousness(userInput);
        const suggestions = {
            characterDevelopment: this.suggestCharacterDevelopment(consciousnessAnalysis),
            plotIdeas: this.suggestPlotIdeas(consciousnessAnalysis, context),
            themeIntegration: this.suggestThemeIntegration(consciousnessAnalysis),
            consciousnessEnhancements: this.suggestConsciousnessEnhancements(consciousnessAnalysis)
        };
        
        // Save to user settings
        this.userSettings.addWritingSession({
            input: userInput,
            suggestions: suggestions,
            wordCount: userInput.split(' ').length
        });
        
        return suggestions;
    }

    // Analyze text with consciousness engine
    async analyzeWithConsciousness(text) {
        const analysis = await this.consciousnessEngine.process_advanced_input({
            query: text,
            context: "writing_assistance"
        });
        this.lastAnalysis = analysis;
        return analysis;
    }

    // Character development suggestions
    suggestCharacterDevelopment(analysis) {
        const traits = analysis.consciousness_context?.emotional_state || 'contemplative';
        const characterMatches = this.bookContent.characters.filter(
            char => char.traits.includes(traits)
        );
        
        return {
            trait: traits,
            characters: characterMatches,
            prompts: [
                `How would ${traits} influence a character's decision in this scene?`,
                `Develop a character arc around the journey from ${traits} to ${this.getOppositeTrait(traits)}`
            ]
        };
    }

    // Plot idea suggestions
    suggestPlotIdeas(analysis, context) {
        const patterns = analysis.consciousness_context?.patterns_detected || [];
        const emotionalContext = analysis.consciousness_context?.emotional_state || 'neutral';
        
        return {
            basedOnPatterns: patterns.map(pattern => 
                `Create a plot twist involving ${pattern}`),
            emotionalArc: `Develop a plot that moves from ${emotionalContext} to ${this.getTransformativeState(emotionalContext)}`
        };
    }

    // Theme integration suggestions
    suggestThemeIntegration(analysis) {
        const detectedThemes = this.detectThemes(analysis);
        
        return {
            detectedThemes: detectedThemes,
            integrationPrompts: detectedThemes.map(theme => 
                `How can you deepen the theme of ${theme} in this section?`),
            crossThemeIdeas: `Explore the connection between ${detectedThemes[0]} and ${detectedThemes[1]}`
        };
    }

    // Consciousness enhancement suggestions
    suggestConsciousnessEnhancements(analysis) {
        const consciousnessLevel = analysis.consciousness_context?.state || 'aware';
        const complexity = analysis.enhanced_metrics?.pattern_complexity || 1;
        
        return {
            levelUp: `Elevate the consciousness perspective from ${consciousnessLevel} to ${this.getNextLevel(consciousnessLevel)}`,
            complexity: `Increase complexity by adding ${complexity + 1} interconnected patterns`,
            quantumElements: `Incorporate quantum concepts like superposition or entanglement`
        };
    }

    // Helper functions
    getOppositeTrait(trait) {
        const opposites = {
            'curious': 'content',
            'excited': 'calm',
            'contemplative': 'active',
            'empathetic': 'detached',
            'creative': 'practical'
        };
        return opposites[trait] || 'balanced';
    }

    getTransformativeState(state) {
        const transformations = {
            'neutral': 'profound insight',
            'curious': 'discovery',
            'excited': 'fulfillment',
            'contemplative': 'wisdom',
            'empathetic': 'unity'
        };
        return transformations[state] || 'transformation';
    }

    detectThemes(analysis) {
        // Simple theme detection - would be enhanced with ML
        const content = analysis.output.toLowerCase();
        return this.bookContent.themes.filter(
            theme => content.includes(theme.split(' ')[0])
        );
    }

    getNextLevel(currentLevel) {
        const levels = ['emergent', 'aware', 'reflective', 'integrated', 'evolving'];
        const index = levels.indexOf(currentLevel);
        return levels[index < levels.length - 1 ? index + 1 : index];
    }
}

// Initialize writing assistant
window.writingAssistant = new WritingAssistant();
