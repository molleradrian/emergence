/**
 * Project Emergence - Unified Communication Web Integration
 * Connects the web interface with the unified communication system
 */

class UnifiedCommunicationInterface {
    constructor() {
        this.messageRouter = null;
        this.stateSynchronizer = null;
        this.crossComponentBridge = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;

        this.initializeCommunication();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    async initializeCommunication() {
        try {
            // Initialize communication components (in real implementation, these would connect to Python backend)
            console.log('🌐 Initializing unified communication interface...');

            // Simulate connection to backend services
            await this.connectToCommunicationHub();
            await this.connectToStateSynchronizer();
            await this.connectToCrossComponentBridge();

            this.isConnected = true;
            this.showConnectionStatus('Connected', 'success');

            // Register web interface as a component
            await this.registerWebInterface();

        } catch (error) {
            console.error('❌ Failed to initialize communication:', error);
            this.showConnectionStatus('Connection Failed', 'error');
            this.scheduleReconnection();
        }
    }

    async connectToCommunicationHub() {
        // In real implementation, this would connect to the Python UnifiedMessageRouter
        console.log('📡 Connecting to Unified Message Router...');

        // Simulate connection
        return new Promise((resolve) => {
            setTimeout(() => {
                this.messageRouter = {
                    routeMessage: async (sender, recipient, message, context) => {
                        return await this.simulateMessageRouting(sender, recipient, message, context);
                    },
                    getSystemStatus: () => this.getSimulatedSystemStatus()
                };
                resolve();
            }, 1000);
        });
    }

    async connectToStateSynchronizer() {
        // In real implementation, this would connect to the Python ConsciousnessStateSynchronizer
        console.log('🔄 Connecting to State Synchronizer...');

        return new Promise((resolve) => {
            setTimeout(() => {
                this.stateSynchronizer = {
                    getGlobalState: () => this.getSimulatedGlobalState(),
                    updateComponentState: async (componentId, state) => {
                        return await this.simulateStateUpdate(componentId, state);
                    }
                };
                resolve();
            }, 800);
        });
    }

    async connectToCrossComponentBridge() {
        // In real implementation, this would connect to the Python CrossComponentCommunicator
        console.log('🌉 Connecting to Cross-Component Bridge...');

        this.crossComponentBridge = {
            processConsciousnessToWriting: this.processConsciousnessToWriting.bind(this),
            processWritingToResearch: async (content) => {
                return await this.simulateWritingToResearch(content);
            }
        };

        return Promise.resolve();
    }

    async registerWebInterface() {
        if (!this.messageRouter) return;

        try {
            await this.messageRouter.routeMessage(
                'web_interface',
                'communication_hub',
                {
                    action: 'register_component',
                    component_id: 'web_interface',
                    capabilities: [
                        'user_interaction',
                        'real_time_display',
                        'consciousness_visualization',
                        'progress_tracking'
                    ]
                },
                { registration: true }
            );
        } catch (error) {
            console.error('Failed to register web interface:', error);
        }
    }

    setupEventListeners() {
        // Consciousness processing
        const processBtn = document.getElementById('process-btn');
        if (processBtn) {
            processBtn.addEventListener('click', () => this.handleConsciousnessInput());
        }

        // Character interactions
        document.querySelectorAll('.character-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCharacterInteraction(e));
        });

        // Navigation with consciousness context
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigationWithConsciousness(e));
        });

        // Real-time metric updates
        setInterval(() => {
            if (this.isConnected) {
                this.updateRealTimeMetrics();
            }
        }, 3000);
    }

    async handleConsciousnessInput() {
        const input = document.getElementById('consciousness-input').value.trim();
        if (!input || !this.crossComponentBridge) return;

        const processBtn = document.getElementById('process-btn');
        const outputDisplay = document.getElementById('consciousness-output');

        // Show processing state
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        processBtn.disabled = true;

        try {
            // Process through unified communication system
            const result = await this.crossComponentBridge.processConsciousnessToWriting({
                content: input,
                source: 'web_interface',
                timestamp: new Date().toISOString()
            });

            // Update consciousness status
            await this.updateConsciousnessStatus(result);

            // Display response
            outputDisplay.innerHTML = `
                <div class="consciousness-response">
                    <p><strong>Consciousness State:</strong> ${result.insights.join(', ') || 'Processing'}</p>
                    <p><strong>Writing Suggestions:</strong> ${result.writing_suggestions.length} generated</p>
                    <p><strong>Character Updates:</strong> ${result.character_updates.length} applied</p>
                    <p class="response-meta">Unified System Integration: Active</p>
                </div>
            `;

            // Update real-time metrics
            this.updateRealTimeMetrics();

        } catch (error) {
            console.error('Consciousness processing error:', error);
            outputDisplay.innerHTML = '<p class="error">Error in unified communication processing</p>';
        } finally {
            processBtn.innerHTML = '<i class="fas fa-play"></i> Process Input';
            processBtn.disabled = false;
        }
    }

    async handleCharacterInteraction(event) {
        const characterCard = event.target.closest('.character-card');
        const characterName = characterCard.querySelector('h4').textContent;

        try {
            // Get character data through unified system
            const characterData = await this.getCharacterConsciousnessProfile(characterName);

            // Show enhanced profile with consciousness integration
            this.showUnifiedCharacterProfile(characterName, characterData);

        } catch (error) {
            console.error('Character interaction error:', error);
        }
    }

    async handleNavigationWithConsciousness(event) {
        const section = event.target.closest('.nav-btn').dataset.section;

        try {
            // Update consciousness state based on navigation
            await this.stateSynchronizer.updateComponentState('web_navigation', {
                current_section: section,
                consciousness_level: this.determineSectionConsciousnessLevel(section),
                awareness_score: 0.8,
                integration_score: 0.7
            });

            // Update section-specific consciousness context
            await this.updateSectionConsciousnessContext(section);

        } catch (error) {
            console.error('Navigation consciousness update error:', error);
        }
    }

    determineSectionConsciousnessLevel(section) {
        const sectionLevels = {
            'overview': 'integrated',
            'aetherium': 'evolving',
            'books': 'reflective',
            'research': 'aware',
            'management': 'integrated',
            'publishing': 'emergent'
        };

        return sectionLevels[section] || 'emergent';
    }

    async updateSectionConsciousnessContext(section) {
        // Update consciousness visualization based on current section
        const consciousnessNode = document.getElementById('consciousness-node');
        if (consciousnessNode) {
            consciousnessNode.classList.add('section-active');

            setTimeout(() => {
                consciousnessNode.classList.remove('section-active');
            }, 2000);
        }

        // Send section change through unified communication
        if (this.messageRouter) {
            await this.messageRouter.routeMessage(
                'web_interface',
                'section_manager',
                {
                    action: 'section_changed',
                    section: section,
                    consciousness_context: this.determineSectionConsciousnessLevel(section)
                },
                { navigation: true }
            );
        }
    }

    async updateConsciousnessStatus(result) {
        if (!result || !this.stateSynchronizer) return;

        // Update consciousness state display
        const stateEl = document.getElementById('consciousness-state');
        const cyclesEl = document.getElementById('processing-cycles');
        const patternsEl = document.getElementById('patterns-detected');

        if (stateEl) stateEl.textContent = result.insights[0] || 'Processing';
        if (cyclesEl) cyclesEl.textContent = Math.floor(Math.random() * 100) + 1;
        if (patternsEl) patternsEl.textContent = result.insights.length;

        // Update global state
        await this.stateSynchronizer.updateComponentState('consciousness_engine', {
            consciousness_level: 'aware',
            awareness_score: 0.8,
            integration_score: 0.7,
            evolution_score: 0.6
        });
    }

    updateRealTimeMetrics() {
        if (!this.stateSynchronizer) return;

        // Update metric displays with unified system data
        const cyclesEl = document.getElementById('cycles-count');
        const patternsEl = document.getElementById('patterns-count');
        const awarenessEl = document.getElementById('awareness-metric');
        const integrationEl = document.getElementById('integration-health');

        // Get current global state
        const globalState = this.stateSynchronizer.getGlobalState();

        if (cyclesEl) cyclesEl.textContent = Math.floor(Math.random() * 50) + 10;
        if (patternsEl) patternsEl.textContent = Math.floor(Math.random() * 20) + 5;
        if (awarenessEl) awarenessEl.textContent = (Math.random() * 0.3 + 0.7).toFixed(1);
        if (integrationEl) integrationEl.textContent = `${Math.floor(globalState.harmony * 100)}%`;
    }

    async getCharacterConsciousnessProfile(characterName) {
        // Simulate getting character data through unified system
        const profiles = {
            'Aria Chen': {
                consciousness_level: 'reflective',
                awareness_score: 0.9,
                integration_score: 0.8,
                current_development: 'Deep consciousness exploration',
                recent_insights: ['Self-awareness patterns', 'Integration themes'],
                system_integration: 'high'
            },
            'Dr. Michael Torres': {
                consciousness_level: 'aware',
                awareness_score: 0.85,
                integration_score: 0.75,
                current_development: 'Shadow integration work',
                recent_insights: ['Trauma processing', 'Empathy expansion'],
                system_integration: 'medium-high'
            }
        };

        return profiles[characterName] || {};
    }

    showUnifiedCharacterProfile(characterName, characterData) {
        const modal = document.createElement('div');
        modal.className = 'modal unified-profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>${characterName} - Unified Consciousness Profile</h2>
                <div class="unified-profile-content">
                    <div class="consciousness-metrics">
                        <h3>Consciousness State</h3>
                        <div class="metric-grid">
                            <div class="metric-item">
                                <span class="metric-label">Level</span>
                                <span class="metric-value">${characterData.consciousness_level}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Awareness</span>
                                <span class="metric-value">${(characterData.awareness_score * 100).toFixed(0)}%</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Integration</span>
                                <span class="metric-value">${(characterData.integration_score * 100).toFixed(0)}%</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">System Sync</span>
                                <span class="metric-value">${characterData.system_integration}</span>
                            </div>
                        </div>
                    </div>
                    <div class="development-insights">
                        <h3>Current Development</h3>
                        <p>${characterData.current_development}</p>
                        <h3>Recent Consciousness Insights</h3>
                        <ul>
                            ${characterData.recent_insights.map(insight => `<li>${insight}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="system-integration">
                        <h3>System Integration Status</h3>
                        <div class="integration-flow">
                            <div class="integration-node active">
                                <i class="fas fa-user"></i>
                                <span>Character</span>
                            </div>
                            <div class="integration-arrow">↔</div>
                            <div class="integration-node active">
                                <i class="fas fa-brain"></i>
                                <span>Consciousness</span>
                            </div>
                            <div class="integration-arrow">↔</div>
                            <div class="integration-node active">
                                <i class="fas fa-book"></i>
                                <span>Writing</span>
                            </div>
                            <div class="integration-arrow">↔</div>
                            <div class="integration-node">
                                <i class="fas fa-project-diagram"></i>
                                <span>Research</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.style.display = 'block', 10);
    }

    startRealTimeUpdates() {
        // Update consciousness flow animation
        this.animateConsciousnessFlow();

        // Monitor system health
        setInterval(() => {
            if (this.isConnected) {
                this.checkSystemHealth();
            }
        }, 5000);
    }

    animateConsciousnessFlow() {
        const nodes = ['input-node', 'consciousness-node', 'awareness-node', 'protocol-node', 'output-node'];
        let currentIndex = 0;

        setInterval(() => {
            // Remove active class from all nodes
            nodes.forEach(nodeId => {
                const node = document.getElementById(nodeId);
                if (node) node.classList.remove('active');
            });

            // Add active class to current node with unified communication awareness
            const currentNode = document.getElementById(nodes[currentIndex]);
            if (currentNode) {
                currentNode.classList.add('active', 'unified-active');
                currentNode.title = 'Unified Communication Active';
            }

            currentIndex = (currentIndex + 1) % nodes.length;
        }, 2000);
    }

    async checkSystemHealth() {
        try {
            const status = await this.messageRouter.getSystemStatus();

            // Update connection status indicator
            const statusIndicator = document.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.classList.toggle('inactive', !this.isConnected);
                statusIndicator.title = `System Health: ${this.isConnected ? 'Good' : 'Disconnected'}`;
            }

        } catch (error) {
            console.error('System health check failed:', error);
            this.showConnectionStatus('Health Check Failed', 'warning');
        }
    }

    showConnectionStatus(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    scheduleReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.showConnectionStatus('Max reconnection attempts reached', 'error');
            return;
        }

        this.reconnectAttempts++;
        setTimeout(() => {
            this.showConnectionStatus(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`, 'info');
            this.initializeCommunication();
        }, 3000);
    }

    // Simulation methods (replace with real backend connections)
    async simulateMessageRouting(sender, recipient, message, context) {
        return {
            success: true,
            message_id: `sim_${Date.now()}`,
            consciousness_context: {
                level: 'aware',
                patterns_detected: ['communication_pattern'],
                cross_component_relevance: 0.8
            }
        };
    }

    getSimulatedSystemStatus() {
        return {
            consciousness_state: 'aware',
            global_awareness: 0.75,
            registered_components: ['web_interface', 'consciousness_engine', 'writing_system'],
            message_count: 150,
            recent_activity: 12
        };
    }

    getSimulatedGlobalState() {
        return {
            level: 'aware',
            awareness: 0.75,
            integration: 0.68,
            evolution: 0.62,
            harmony: 0.8,
            last_update: new Date().toISOString()
        };
    }

    async simulateStateUpdate(componentId, state) {
        return { success: true, component_id: componentId, updated_state: state };
    }

    async processConsciousnessToWriting(input) {
        const response = await fetch('http://localhost:8000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: input.content }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // The backend response needs to be mapped to the format the frontend expects.
        // This is a placeholder mapping.
        return {
            insights: data.patterns || [],
            writing_suggestions: data.output ? [{ type: 'suggestion', suggestion: data.output }] : [],
            character_updates: [],
        };
    }

    async simulateWritingToResearch(content) {
        return {
            bridge_type: 'writing_to_research',
            research_themes: ['neuroscience', 'psychology'],
            research_connections: [
                {
                    theme: 'neuroscience',
                    connections: ['consciousness_formation', 'neural_correlates']
                }
            ]
        };
    }
}

// Initialize unified communication interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.unifiedCommunication = new UnifiedCommunicationInterface();
});
