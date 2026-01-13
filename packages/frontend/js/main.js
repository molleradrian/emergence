// Main JavaScript for Project Emergence Dashboard

class ProjectEmergence {
    constructor() {
        this.currentSection = 'overview';
        this.data = {};
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.loadData();
        this.updateProgressBars();
        this.startAutoRefresh();
        this.startConsciousnessUpdates();

        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1500);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
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

    async loadAetheriumData() {
        console.log('Loading Aetherium data...');
        // Load Aetherium-specific data
        // In a real implementation, this would fetch from the consciousness engine
    }

    async loadBooksData() {
        console.log('Loading Books data...');
        // Load book series data
        // In a real implementation, this would fetch from the book management system
    }

    async loadResearchData() {
        console.log('Loading Research data...');
        // Load research data
        // In a real implementation, this would fetch from the research database
    }

    async loadManagementData() {
        console.log('Loading Management data...');
        // Load project management data
        // In a real implementation, this would fetch from the project management system
    }

    async loadPublishingData() {
        console.log('Loading Publishing data...');
        // Load publishing data
        // In a real implementation, this would fetch from the publishing system
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
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });
    }

    // Enhanced consciousness flow animation and real-time updates
    startConsciousnessUpdates() {
        // Start consciousness engine status updates
        setInterval(() => {
            if (this.currentSection === 'aetherium' || this.currentSection === 'overview') {
                if (window.unifiedCommunication) {
                    window.unifiedCommunication.updateRealTimeMetrics();
                }
            }
        }, 3000); // Update every 3 seconds

        // Start consciousness flow animation
        if (window.unifiedCommunication) {
            window.unifiedCommunication.animateConsciousnessFlow();
        }
    }

    handleKeyboardShortcut(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.key) {
            case '1':
                if (e.altKey) {
                    e.preventDefault();
                    this.navigateTo('overview');
                }
                break;
            case '2':
                if (e.altKey) {
                    e.preventDefault();
                    this.navigateTo('aetherium');
                }
                break;
            case '3':
                if (e.altKey) {
                    e.preventDefault();
                    this.navigateTo('books');
                }
                break;
            case '4':
                if (e.altKey) {
                    e.preventDefault();
                    this.navigateTo('research');
                }
                break;
            case '5':
                if (e.altKey) {
                    e.preventDefault();
                    this.navigateTo('management');
                }
                break;
            case 'p':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.processConsciousnessInput();
                }
                break;
            case 's':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.syncWithFileSystem();
                }
                break;
            case 'Escape':
                this.closeModal();
                break;
        }
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
