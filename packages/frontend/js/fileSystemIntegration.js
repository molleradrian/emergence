/**
 * Project Emergence - File System Integration Client
 * Connects web interface with backend file system operations
 */

class FileSystemIntegration {
    constructor(baseUrl = 'http://localhost:8000/api') {
        this.baseUrl = baseUrl;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;

        this.initializeConnection();
    }

    async initializeConnection() {
        try {
            // Test connection
            await this.testConnection();
            this.isConnected = true;
            this.showConnectionStatus('File System Integration Active', 'success');
        } catch (error) {
            console.error('File system integration not available:', error);
            this.showConnectionStatus('File System Integration Offline', 'warning');
            this.scheduleReconnection();
        }
    }

    async testConnection() {
        const response = await fetch(`${this.baseUrl}/status`);
        if (!response.ok) {
            throw new Error('Backend server not available');
        }
        return await response.json();
    }

    scheduleReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            return;
        }

        this.reconnectAttempts++;
        setTimeout(() => {
            this.initializeConnection();
        }, 5000);
    }

    showConnectionStatus(message, type = 'info') {
        const statusElement = document.getElementById('fs-integration-status') ||
                             this.createStatusElement();

        statusElement.textContent = message;
        statusElement.className = `fs-status ${type}`;

        if (type === 'success') {
            statusElement.classList.add('connected');
        }
    }

    createStatusElement() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'fs-integration-status';
        statusDiv.className = 'fs-status';

        // Add to header system status area
        const systemStatus = document.querySelector('.system-status');
        if (systemStatus) {
            systemStatus.appendChild(statusDiv);
        }

        return statusDiv;
    }

    // Consciousness Processing with File System Integration
    async processConsciousnessWithPersistence(inputText) {
        if (!this.isConnected) {
            throw new Error('File system integration not available');
        }

        try {
            const response = await fetch(`${this.baseUrl}/consciousness/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    input: inputText,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                this.showNotification('Consciousness analysis saved to project files', 'success');
                return result;
            } else {
                throw new Error(result.message || 'Processing failed');
            }

        } catch (error) {
            console.error('Consciousness processing error:', error);
            this.showNotification('Consciousness processing completed (offline mode)', 'info');
            // Return mock result for offline mode
            return this.getMockConsciousnessResult(inputText);
        }
    }

    // Writing Progress Updates
    async updateWritingProgress(progressData) {
        if (!this.isConnected) {
            console.log('Writing progress (offline):', progressData);
            this.showNotification('Writing progress noted (offline mode)', 'info');
            return { success: true, offline: true };
        }

        try {
            const response = await fetch(`${this.baseUrl}/writing/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progressData)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Writing progress saved to project timeline', 'success');
            }

            return result;

        } catch (error) {
            console.error('Writing update error:', error);
            this.showNotification('Writing progress noted (offline mode)', 'info');
            return { success: true, offline: true };
        }
    }

    // Research Logging
    async logResearchFinding(researchData) {
        if (!this.isConnected) {
            console.log('Research finding (offline):', researchData);
            this.showNotification('Research finding noted (offline mode)', 'info');
            return { success: true, offline: true };
        }

        try {
            const response = await fetch(`${this.baseUrl}/research/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(researchData)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Research finding logged to knowledge base', 'success');
            }

            return result;

        } catch (error) {
            console.error('Research logging error:', error);
            this.showNotification('Research finding noted (offline mode)', 'info');
            return { success: true, offline: true };
        }
    }

    // Timeline Updates
    async updateProjectTimeline(timelineData) {
        if (!this.isConnected) {
            console.log('Timeline update (offline):', timelineData);
            this.showNotification('Timeline updated (offline mode)', 'info');
            return { success: true, offline: true };
        }

        try {
            const response = await fetch(`${this.baseUrl}/timeline/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(timelineData)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Project timeline updated', 'success');
            }

            return result;

        } catch (error) {
            console.error('Timeline update error:', error);
            this.showNotification('Timeline updated (offline mode)', 'info');
            return { success: true, offline: true };
        }
    }

    // Get Project Status
    async getProjectStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/status`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Status check error:', error);
        }

        // Return offline status
        return {
            success: true,
            offline: true,
            status: {
                components: {
                    consciousness_analyses: 0,
                    writing_sessions: 0,
                    research_entries: 0,
                    patterns_detected: 0
                }
            }
        };
    }

    // Mock results for offline mode
    getMockConsciousnessResult(inputText) {
        return {
            success: true,
            offline: true,
            analysis: {
                insights: ['self_reflective_narrative', 'identity_exploration'],
                writing_suggestions: [
                    {
                        type: 'character_development',
                        suggestion: 'Enhanced consciousness integration for character arc'
                    }
                ],
                character_updates: [
                    {
                        character: 'aria_chen',
                        update_type: 'consciousness_integration'
                    }
                ]
            },
            file_saved: null,
            timestamp: new Date().toISOString()
        };
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification fs-notification ${type}`;
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
}

// Initialize file system integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fileSystemIntegration = new FileSystemIntegration();
});
