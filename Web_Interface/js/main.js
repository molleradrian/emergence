// Main JavaScript for Project Emergence Dashboard

class ProjectEmergence {
    constructor() {
        this.currentSection = 'overview';
        this.data = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.updateProgressBars();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.navigateTo(section);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.quick-action-btn').dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Sync button
        document.getElementById('syncBtn').addEventListener('click', () => {
            this.syncWithFileSystem();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.navigateTo(section);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.quick-action-btn').dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Sync button
        document.getElementById('syncBtn').addEventListener('click', () => {
            this.syncWithFileSystem();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        // Consciousness Engine Integration
        if (document.getElementById('process-btn')) {
            document.getElementById('process-btn').addEventListener('click', () => {
                this.processConsciousnessInput();
            });
        }

        // Character profile buttons
        document.querySelectorAll('.character-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const characterName = e.target.closest('.character-card').querySelector('h4').textContent;
                this.showCharacterProfile(characterName);
            });
        });

        // Auto-save on changes
        setInterval(() => {
            this.autoSave();
        }, 30000); // Auto-save every 30 seconds
    }

    navigateTo(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show target section
        document.getElementById(`${section}-section`).classList.add('active');

        // Add active class to nav button
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        this.currentSection = section;
        this.loadSectionData(section);
    }

    handleQuickAction(action) {
        switch(action) {
            case 'new-protocol':
                this.createNewProtocol();
                break;
            case 'new-chapter':
                this.createNewChapter();
                break;
            case 'log-research':
                this.logResearch();
                break;
            case 'update-progress':
                this.updateProgress();
                break;
        }
    }

    async loadData() {
        try {
            // Load project data from JSON files
            this.data = {
                progress: {
                    aetherium: 65,
                    books: 40,
                    research: 80,
                    publishing: 25
                },
                activities: [
                    { type: 'edit', description: 'Updated Aetherium protocol template', time: '2 hours ago' },
                    { type: 'plus', description: 'Added new research connection mapping', time: '4 hours ago' },
                    { type: 'check', description: 'Completed book series outline template', time: '1 day ago' }
                ],
                milestones: [
                    { name: 'Complete project infrastructure', completed: true },
                    { name: 'Research integration framework', completed: true },
                    { name: 'Aetherium System core functionality', completed: false }
                ]
            };

            this.updateUI();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    updateUI() {
        this.updateProgressBars();
        this.updateActivityList();
        this.updateMilestones();
    }

    updateProgressBars() {
        // Update progress bars based on current data
        const progressCards = document.querySelectorAll('.progress-card');
        progressCards.forEach((card, index) => {
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            const progress = Object.values(this.data.progress)[index];

            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
        });
    }

    updateActivityList() {
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = '';

        this.data.activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${activity.type}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    updateMilestones() {
        const milestoneList = document.querySelector('.milestone-list');
        if (milestoneList) {
            milestoneList.innerHTML = '';

            this.data.milestones.forEach(milestone => {
                const milestoneItem = document.createElement('div');
                milestoneItem.className = 'milestone-item';
                milestoneItem.innerHTML = `
                    <input type="checkbox" ${milestone.completed ? 'checked' : ''}>
                    <span>${milestone.name}</span>
                `;
                milestoneList.appendChild(milestoneItem);
            });
        }
    }

    async loadSectionData(section) {
        // Load section-specific data
        switch(section) {
            case 'aetherium':
                this.loadAetheriumData();
                break;
            case 'books':
                this.loadBooksData();
                break;
            case 'research':
                this.loadResearchData();
                break;
            case 'management':
                this.loadManagementData();
                break;
            case 'publishing':
                this.loadPublishingData();
                break;
        }
    }

    async syncWithFileSystem() {
        const syncBtn = document.getElementById('syncBtn');
        const originalText = syncBtn.innerHTML;

        // Show loading state
        syncBtn.innerHTML = '<div class="loading"></div> Syncing...';
        syncBtn.disabled = true;

        try {
            // Simulate sync with file system
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success
            syncBtn.innerHTML = '<i class="fas fa-check"></i> Synced!';
            setTimeout(() => {
                syncBtn.innerHTML = originalText;
                syncBtn.disabled = false;
            }, 2000);

            this.showAlert('Data synchronized successfully!', 'success');
        } catch (error) {
            syncBtn.innerHTML = originalText;
            syncBtn.disabled = false;
            this.showAlert('Sync failed. Please try again.', 'danger');
        }
    }

    showSettings() {
        // Show settings modal
        this.showModal('Settings', `
            <div class="form-group">
                <label>Auto-sync interval (minutes):</label>
                <input type="number" class="form-control" value="5" id="syncInterval">
            </div>
            <div class="form-group">
                <label>Theme:</label>
                <select class="form-control" id="themeSelect">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                </select>
            </div>
            <button class="component-btn" onclick="projectEmergence.saveSettings()">Save Settings</button>
        `);
    }

    saveSettings() {
        const syncInterval = document.getElementById('syncInterval').value;
        const theme = document.getElementById('themeSelect').value;

        // Save settings (in a real app, this would persist to storage)
        console.log('Settings saved:', { syncInterval, theme });

        this.closeModal();
        this.showAlert('Settings saved successfully!', 'success');
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="projectEmergence.closeModal()">&times;</span>
                <h2>${title}</h2>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.style.display = 'block', 10);
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        }
    }

    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(alert, mainContent.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    autoSave() {
        // Auto-save current state
        console.log('Auto-saving project state...');
        // In a real implementation, this would save to localStorage or server
    }

    startAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            this.loadData();
        }, 300000);
    }

    // Section-specific data loading
    loadAetheriumData() {
        console.log('Loading Aetherium data...');
        // Load Aetherium-specific data
    }

    loadBooksData() {
        console.log('Loading Books data...');
        // Load book series data
    }

    loadResearchData() {
        console.log('Loading Research data...');
        // Load research data
    }

    loadManagementData() {
        console.log('Loading Management data...');
        // Load project management data
    }

    loadPublishingData() {
        console.log('Loading Publishing data...');
        // Load publishing data
    }

    // Quick action handlers
    createNewProtocol() {
        this.showModal('New Protocol', `
            <div class="form-group">
                <label>Protocol Name:</label>
                <input type="text" class="form-control" placeholder="Enter protocol name">
            </div>
            <div class="form-group">
                <label>Description:</label>
                <textarea class="form-control" rows="3" placeholder="Brief description"></textarea>
            </div>
            <button class="component-btn">Create Protocol</button>
        `);
    }

    createNewChapter() {
        this.showModal('New Chapter', `
            <div class="form-group">
                <label>Book:</label>
                <select class="form-control">
                    <option>Book 1</option>
                    <option>Book 2</option>
                    <option>Book 3</option>
                </select>
            </div>
            <div class="form-group">
                <label>Chapter Title:</label>
                <input type="text" class="form-control" placeholder="Chapter title">
            </div>
            <button class="component-btn">Start Writing</button>
        `);
    }

    logResearch() {
        this.showModal('Log Research', `
            <div class="form-group">
                <label>Research Topic:</label>
                <input type="text" class="form-control" placeholder="Research topic">
            </div>
            <div class="form-group">
                <label>Findings:</label>
                <textarea class="form-control" rows="3" placeholder="Key findings"></textarea>
            </div>
            <button class="component-btn">Log Research</button>
        `);
    }

    updateProgress() {
        this.showModal('Update Progress', `
            <div class="form-group">
                <label>Component:</label>
                <select class="form-control">
                    <option>Aetherium System</option>
                    <option>Book Series</option>
                    <option>Research</option>
                    <option>Publishing</option>
                </select>
            </div>
            <div class="form-group">
                <label>Progress (%):</label>
                <input type="number" class="form-control" min="0" max="100">
            </div>
            <button class="component-btn">Update Progress</button>
        `);
    }

    // Enhanced consciousness processing with file system integration
    async processConsciousnessInput() {
        const input = document.getElementById('consciousness-input').value.trim();
        if (!input) {
            this.showNotification('Please enter some text to process', 'warning');
            return;
        }

        // Show processing state
        const processBtn = document.getElementById('process-btn');
        const outputDisplay = document.getElementById('consciousness-output');

        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        processBtn.disabled = true;

        try {
            let result;

            // Try file system integration first
            if (window.fileSystemIntegration && window.fileSystemIntegration.isConnected) {
                result = await window.fileSystemIntegration.processConsciousnessWithPersistence(input);
                this.showNotification('Consciousness analysis saved to project files', 'success');
            } else {
                // Fallback to unified communication system
                result = await this.simulateConsciousnessProcessing(input);
                this.showNotification('Consciousness processing completed', 'info');
            }

            // Update consciousness status
            this.updateConsciousnessStatus(result);
                    <p><strong>Character Updates:</strong> ${result.analysis.character_updates.length} applied</p>
                    ${result.file_saved ? `<p class="file-saved"><i class="fas fa-save"></i> Saved to: ${result.file_saved}</p>` : ''}
                    <p class="response-meta">Unified System Integration: ${result.offline ? 'Offline Mode' : 'Active'}</p>
                </div>
            `;

            // Update real-time metrics
            this.updateMetrics();

        } catch (error) {
            console.error('Consciousness processing error:', error);
            outputDisplay.innerHTML = '<p class="error">Error in unified communication processing</p>';
            this.showNotification('Processing error occurred', 'error');
        } finally {
            processBtn.innerHTML = '<i class="fas fa-play"></i> Process Input';
            processBtn.disabled = false;
        }
    }
        // Update consciousness state display
        const stateEl = document.getElementById('consciousness-state');
        const cyclesEl = document.getElementById('processing-cycles');
        const patternsEl = document.getElementById('patterns-detected');
        const awarenessEl = document.getElementById('awareness-level');

        if (stateEl) stateEl.textContent = context.state;
        if (cyclesEl) cyclesEl.textContent = context.processing_cycle;
        if (patternsEl) patternsEl.textContent = context.patterns_detected.length;
        if (awarenessEl) awarenessEl.textContent = (Math.random() * 0.5 + 0.5).toFixed(1);

        // Update real-time metrics
        this.updateMetrics();
    }

    updateMetrics() {
        // Update real-time metric displays
        const cyclesEl = document.getElementById('cycles-count');
        const patternsEl = document.getElementById('patterns-count');
        const awarenessEl = document.getElementById('awareness-metric');

        if (cyclesEl) cyclesEl.textContent = Math.floor(Math.random() * 50) + 10;
        if (patternsEl) patternsEl.textContent = Math.floor(Math.random() * 20) + 5;
        if (awarenessEl) awarenessEl.textContent = (Math.random() * 0.3 + 0.7).toFixed(1);
    }

    showCharacterProfile(characterName) {
        const profiles = {
            'Aria Chen': {
                archetype: 'The Awakened Observer',
                description: 'Neuroscientist experiencing consciousness awakening through research and personal experience.',
                journey: 'From scientific skepticism to profound consciousness awareness',
                status: '90% Complete'
            },
            'Dr. Michael Torres': {
                archetype: 'The Shadow Integrator',
                description: 'Clinical psychologist confronting his own shadows while helping others heal.',
                journey: 'From emotional armor to authentic vulnerability and wisdom',
                status: '85% Complete'
            }
        };

        const profile = profiles[characterName];
        if (profile) {
            this.showModal(`${characterName} - Character Profile`, `
                <div class="character-profile">
                    <div class="profile-header">
                        <h3>${characterName}</h3>
                        <p class="archetype"><strong>Archetype:</strong> ${profile.archetype}</p>
                    </div>
                    <div class="profile-content">
                        <p><strong>Description:</strong> ${profile.description}</p>
                        <p><strong>Consciousness Journey:</strong> ${profile.journey}</p>
                        <p><strong>Development Status:</strong> ${profile.status}</p>
                    </div>
                    <div class="profile-actions">
                        <button class="component-btn">Edit Profile</button>
                    </div>
                </div>
            `);
        }
    }

    startAutoRefresh() {
        // Start consciousness engine status updates
        setInterval(() => {
            if (this.currentSection === 'aetherium' || this.currentSection === 'overview') {
                this.updateMetrics();
            }
        }, 3000); // Update every 3 seconds

        // Start consciousness flow animation
        this.animateConsciousnessFlow();
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

            // Add active class to current node
            const currentNode = document.getElementById(nodes[currentIndex]);
            if (currentNode) currentNode.classList.add('active');

            currentIndex = (currentIndex + 1) % nodes.length;
        }, 2000); // Change every 2 seconds
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectEmergence = new ProjectEmergence();
});
