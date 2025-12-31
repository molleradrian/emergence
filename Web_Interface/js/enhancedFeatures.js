/**
 * Enhanced Project Emergence Web Interface
 * Consciousness Analytics & Writing Assistant Features
 */

// Pattern Recognition System
class ConsciousnessPatternAnalyzer {
    constructor() {
        this.isAnalyzing = false;
        this.analysisHistory = [];
        this.canvas = null;
        this.networkNodes = [];
        this.networkConnections = [];
    }

    async analyzeText(text) {
        if (!text.trim()) {
            this.showPatternResult('Please enter text to analyze.');
            return;
        }

        this.isAnalyzing = true;
        this.showAnalyzingState();

        try {
            // Simulate pattern recognition analysis
            const patterns = await this.performPatternAnalysis(text);
            this.displayPatternResults(patterns);
            this.updateVisualization(patterns);
            this.analysisHistory.unshift({
                timestamp: new Date(),
                text: text.substring(0, 100) + '...',
                patterns: patterns
            });

        } catch (error) {
            console.error('Pattern analysis error:', error);
            this.showPatternResult('Error analyzing text. Please try again.');
        } finally {
            this.isAnalyzing = false;
        }
    }

    async performPatternAnalysis(text) {
        try {
            // Try to call real backend API
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('Backend Analysis:', data);
                    // Convert backend response to frontend format
                    // Backend returns simple list of patterns strings, map them to objects
                    const apiPatterns = (data.patterns || []).map(p => ({
                        type: 'neural_pattern',
                        description: `Deep analysis detected: ${p}`,
                        confidence: 0.95,
                        keywords: [p],
                        data: { source: 'backend_core', state: data.state }
                    }));

                    // Also include local analysis for UI richness if backend returns few results
                    const localPatterns = this.performLocalAnalysis(text);
                    return [...apiPatterns, ...localPatterns];
                }
            }
        } catch (error) {
            console.log('API unavailable, using local simulation:', error);
        }

        // Fallback to local analysis
        return this.performLocalDetailedAnalysis(text);
    }

    // Renamed original logic
    performLocalDetailedAnalysis(text) {
        // Simulate API call delay for realism if we fell back
        // await new Promise(resolve => setTimeout(resolve, 800));

        const patterns = [];
        const lowerText = text.toLowerCase();

        // Consciousness-related patterns
        const consciousnessKeywords = [
            'consciousness', 'awareness', 'mind', 'thought', 'perception',
            'reality', 'experience', 'self', 'identity', 'reflection'
        ];

        const foundKeywords = consciousnessKeywords.filter(keyword => lowerText.includes(keyword));

        if (foundKeywords.length > 0) {
            patterns.push({
                type: 'consciousness_content',
                description: 'Consciousness-related content detected (Local)',
                confidence: Math.min(foundKeywords.length * 0.2, 1.0),
                keywords: foundKeywords
            });
        }

        // Text structure patterns
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 5) {
            const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
            if (avgLength > 50) {
                patterns.push({
                    type: 'complex_sentences',
                    description: 'Complex sentence structures detected',
                    confidence: Math.min(avgLength / 150, 1.0),
                    data: { avgLength, sentenceCount: sentences.length }
                });
            }
        }

        // Word frequency patterns
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        const repeatedWords = Object.entries(wordFreq).filter(([word, count]) => count > 2);
        if (repeatedWords.length > 0) {
            patterns.push({
                type: 'repetition',
                description: 'Word repetition patterns detected',
                confidence: Math.min(repeatedWords.length * 0.3, 1.0),
                data: repeatedWords.slice(0, 5)
            });
        }

        return patterns.sort((a, b) => b.confidence - a.confidence);
    }

    performLocalAnalysis(text) {
        // Simple helper for mixing results
        return this.performLocalDetailedAnalysis(text);
    }

    showAnalyzingState() {
        const outputDiv = document.getElementById('pattern-output');
        outputDiv.innerHTML = `
            <div class="analyzing-state">
                <div class="analyzing-spinner"></div>
                <p>Analyzing consciousness patterns...</p>
            </div>
        `;
    }

        displayPatternResults(patterns) {
            const outputDiv = document.getElementById('pattern-output');

            if (patterns.length === 0) {
                outputDiv.innerHTML = `
                <div class="no-patterns">
                    <i class="fas fa-search"></i>
                    <p>No significant consciousness patterns detected.</p>
                </div>
            `;
                return;
            }

            const resultsHtml = patterns.map((pattern, index) => `
            <div class="pattern-result">
                <div class="pattern-header">
                    <span class="pattern-number">${index + 1}</span>
                    <span class="pattern-type">${pattern.type.replace('_', ' ').toUpperCase()}</span>
                    <span class="pattern-confidence">${Math.round(pattern.confidence * 100)}%</span>
                </div>
                <p class="pattern-description">${pattern.description}</p>
                ${pattern.keywords ? `<div class="pattern-keywords">
                    <strong>Keywords:</strong> ${pattern.keywords.join(', ')}
                </div>` : ''}
                ${pattern.data ? `<div class="pattern-data">
                    <strong>Data:</strong> ${JSON.stringify(pattern.data)}
                </div>` : ''}
            </div>
        `).join('');

            outputDiv.innerHTML = resultsHtml;
        }

        updateVisualization(patterns) {
            if (!this.canvas) {
                this.canvas = document.getElementById('pattern-canvas');
            }

            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Create network visualization
            this.createNetworkVisualization(ctx, patterns);
        }

        createNetworkVisualization(ctx, patterns) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const radius = 150;

            // Draw central consciousness node
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
            ctx.fillStyle = '#4f46e5';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw pattern nodes
            patterns.forEach((pattern, index) => {
                const angle = (index / patterns.length) * 2 * Math.PI;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                // Node
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, 2 * Math.PI);
                ctx.fillStyle = `hsl(${pattern.confidence * 120}, 70%, 60%)`;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Connection to center
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(79, 70, 229, ${pattern.confidence})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Label
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(pattern.type, x, y + 30);
            });
        }
}

// Writing Assistant System
class ConsciousnessWritingAssistant {
    constructor() {
        this.currentPrompt = null;
        this.productivityData = this.generateMockProductivityData();
        this.integrationData = this.generateMockIntegrationData();
    }

    generateWritingPrompt(category, consciousnessLevel) {
        const prompts = {
            character: {
                emergent: "Describe how your character first becomes aware of subtle changes in their perception, hinting at expanded consciousness without being overt.",
                aware: "Show your character's growing recognition of consciousness patterns in their relationships and decision-making processes.",
                reflective: "Have your character engage in deep self-examination about their consciousness experiences and how they shape their identity.",
                integrated: "Illustrate your character fully embodying their consciousness expansion, using it as a tool for personal and collective transformation."
            },
            scene: {
                emergent: "Create a scene where everyday environments take on new significance as your character experiences subtle consciousness field effects.",
                aware: "Build a scene around a moment of shared awareness between characters, where consciousness fields create unexpected connections.",
                reflective: "Develop a scene of introspection where your character processes the implications of their consciousness expansion on their relationships and purpose.",
                integrated: "Craft a scene showing your character using consciousness control to navigate a complex social or professional situation."
            },
            dialogue: {
                emergent: "Write dialogue that subtly reveals a character's growing awareness, using metaphors and indirect references to consciousness themes.",
                aware: "Create conversation where characters discuss their shared consciousness experiences, exploring the impact on their understanding of reality.",
                reflective: "Develop dialogue where characters confront the philosophical implications of consciousness expansion on identity and human connection.",
                integrated: "Write dialogue showing characters using consciousness awareness to resolve conflict or deepen understanding in their relationships."
            },
            theme: {
                emergent: "Explore how consciousness themes manifest in subtle ways through setting descriptions and character observations.",
                aware: "Weave consciousness concepts into the fabric of your story world, showing how they influence culture and technology.",
                reflective: "Examine the deeper philosophical questions raised by consciousness expansion through character introspection and thematic elements.",
                integrated: "Demonstrate how consciousness themes create transformation at both personal and societal levels in your narrative."
            }
        };

        const prompt = prompts[category]?.[consciousnessLevel] || prompts.character.emergent;

        this.currentPrompt = {
            category,
            consciousnessLevel,
            prompt,
            generatedAt: new Date()
        };

        return this.currentPrompt;
    }

    displayPrompt() {
        const promptOutput = document.getElementById('prompt-output');
        if (!this.currentPrompt) {
            promptOutput.innerHTML = `
                <div class="prompt-placeholder">
                    <i class="fas fa-brain"></i>
                    <p>Select a category and consciousness level, then click "Generate Prompt"...</p>
                </div>
            `;
            return;
        }

        promptOutput.innerHTML = `
            <div class="generated-prompt-content">
                <div class="prompt-meta">
                    <span class="prompt-category">${this.currentPrompt.category.charAt(0).toUpperCase() + this.currentPrompt.category.slice(1)}</span>
                    <span class="consciousness-level">${this.currentPrompt.consciousnessLevel.replace('_', ' ')}</span>
                </div>
                <p class="prompt-text">${this.currentPrompt.prompt}</p>
                <div class="prompt-actions">
                    <button class="copy-prompt-btn" onclick="writingAssistant.copyPrompt()">
                        <i class="fas fa-copy"></i> Copy to Clipboard
                    </button>
                </div>
            </div>
        `;
    }

    copyPrompt() {
        if (this.currentPrompt) {
            navigator.clipboard.writeText(this.currentPrompt.prompt);
            this.showNotification('Prompt copied to clipboard!');
        }
    }

    initializeCharts() {
        this.createProductivityChart();
        this.createIntegrationChart();
    }

    createProductivityChart() {
        const ctx = document.getElementById('writing-productivity-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.productivityData.labels,
                datasets: [{
                    label: 'Words Written',
                    data: this.productivityData.words,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Writing Productivity Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Words'
                        }
                    }
                }
            }
        });
    }

    createIntegrationChart() {
        const ctx = document.getElementById('consciousness-integration-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Consciousness Integration', 'Research Accuracy', 'Theme Consistency'],
                datasets: [{
                    data: [98, 95, 92],
                    backgroundColor: [
                        '#4f46e5',
                        '#10b981',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Writing Quality Metrics'
                    }
                }
            }
        });
    }

    generateMockProductivityData() {
        const days = [];
        const words = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString());

            // Generate realistic word counts with some variation
            const baseWords = 2500 + (Math.random() - 0.5) * 1000;
            words.push(Math.max(0, Math.round(baseWords)));
        }

        return { labels: days, words };
    }

    generateMockIntegrationData() {
        return {
            consciousness: 98,
            research: 95,
            themes: 92
        };
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global instances
const patternAnalyzer = new ConsciousnessPatternAnalyzer();
const writingAssistant = new ConsciousnessWritingAssistant();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Pattern analyzer functionality
    const analyzeBtn = document.getElementById('analyze-btn');
    const patternInput = document.getElementById('pattern-input');

    if (analyzeBtn && patternInput) {
        analyzeBtn.addEventListener('click', () => {
            patternAnalyzer.analyzeText(patternInput.value);
        });

        patternInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                patternAnalyzer.analyzeText(patternInput.value);
            }
        });
    }

    // Writing assistant functionality
    const generatePromptBtn = document.getElementById('generate-prompt-btn');
    const promptCategories = document.querySelectorAll('.prompt-category');
    const consciousnessLevel = document.getElementById('consciousness-level');

    let selectedCategory = 'character';

    promptCategories.forEach(btn => {
        btn.addEventListener('click', () => {
            promptCategories.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.dataset.category;
        });
    });

    if (generatePromptBtn) {
        generatePromptBtn.addEventListener('click', () => {
            const prompt = writingAssistant.generateWritingPrompt(selectedCategory, consciousnessLevel.value);
            writingAssistant.displayPrompt();
        });
    }

    // Initialize charts
    writingAssistant.initializeCharts();

    // Visualization controls
    const vizBtns = document.querySelectorAll('.viz-btn');
    vizBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            vizBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Update visualization based on selected view
            updateVisualization(btn.dataset.viz);
        });
    });
});

function updateVisualization(viewType) {
    // Update pattern visualization based on selected view
    const canvas = document.getElementById('pattern-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (viewType) {
        case 'network':
            patternAnalyzer.createNetworkVisualization(ctx, []);
            break;
        case 'timeline':
            createTimelineVisualization(ctx);
            break;
        case 'heatmap':
            createHeatmapVisualization(ctx);
            break;
    }
}

function createTimelineVisualization(ctx) {
    // Create timeline view of pattern analysis over time
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, ctx.canvas.height - 50);

    // Draw sample timeline data
    for (let i = 1; i < 20; i++) {
        const x = 50 + (i / 19) * (ctx.canvas.width - 100);
        const y = ctx.canvas.height - 50 - (Math.random() * 100 + 50);
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Pattern Analysis Timeline', 50, 30);
}

function createHeatmapVisualization(ctx) {
    // Create heatmap view of pattern density
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw heatmap grid
    const rows = 10;
    const cols = 15;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const intensity = Math.random();
            const x = 50 + col * 40;
            const y = 50 + row * 30;

            ctx.fillStyle = `rgba(79, 70, 229, ${intensity})`;
            ctx.fillRect(x, y, 35, 25);
        }
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Pattern Density Heatmap', 50, 30);
}

// Export for use in other files
window.patternAnalyzer = patternAnalyzer;
window.writingAssistant = writingAssistant;
