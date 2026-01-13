// User Settings Manager - Handles all user-specific data persistence

class UserSettingsManager {
    constructor() {
        // Initialize with default settings
        this.settings = this.loadSettings();
        this.writingSessions = this.loadWritingSessions();
        this.promptHistory = this.loadPromptHistory();
        this.researchSessions = this.loadResearchSessions();
    }

    // Settings management
    loadSettings() {
        const settings = localStorage.getItem('userSettings');
        return settings ? JSON.parse(settings) : {
            consciousnessLevel: 'aware',
            researchInterests: ['Neuroscience', 'Psychology', 'Philosophy'],
            writingPreferences: ['Sci-Fi', 'Consciousness Themes'],
            theme: 'light',
            notifications: true,
            autoSave: true,
            fontSize: 16,
            keyboardShortcuts: true
        };
    }

    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.settings));
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        return this.settings;
    }

    // Writing sessions management
    loadWritingSessions() {
        const sessions = localStorage.getItem('writingSessions');
        return sessions ? JSON.parse(sessions) : [];
    }

    saveWritingSessions() {
        localStorage.setItem('writingSessions', JSON.stringify(this.writingSessions));
    }

    addWritingSession(session) {
        const newSession = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...session
        };
        this.writingSessions.unshift(newSession);
        
        // Keep only last 20 sessions
        if (this.writingSessions.length > 20) {
            this.writingSessions = this.writingSessions.slice(0, 20);
        }
        
        this.saveWritingSessions();
        return newSession;
    }

    getWritingStatistics() {
        const stats = {
            totalWords: 0,
            totalSessions: this.writingSessions.length,
            lastSession: this.writingSessions[0] || null,
            favoriteCategory: '',
            wordsPerSession: {}
        };
        
        const categoryCounts = {};
        
        this.writingSessions.forEach(session => {
            stats.totalWords += session.wordCount || 0;
            
            // Count categories
            if (session.category) {
                categoryCounts[session.category] = (categoryCounts[session.category] || 0) + 1;
            }
            
            // Store words per session
            const date = new Date(session.timestamp).toLocaleDateString();
            stats.wordsPerSession[date] = (stats.wordsPerSession[date] || 0) + (session.wordCount || 0);
        });
        
        // Find most frequent category
        let maxCount = 0;
        for (const [category, count] of Object.entries(categoryCounts)) {
            if (count > maxCount) {
                maxCount = count;
                stats.favoriteCategory = category;
            }
        }
        
        return stats;
    }

    // Prompt history management
    loadPromptHistory() {
        const history = localStorage.getItem('promptHistory');
        return history ? JSON.parse(history) : [];
    }

    savePromptHistory() {
        localStorage.setItem('promptHistory', JSON.stringify(this.promptHistory));
    }

    addPromptToHistory(prompt) {
        this.promptHistory.unshift(prompt);
        
        // Keep only last 10 prompts
        if (this.promptHistory.length > 10) {
            this.promptHistory = this.promptHistory.slice(0, 10);
        }
        
        this.savePromptHistory();
        return this.promptHistory;
    }

    // Research sessions management
    loadResearchSessions() {
        const sessions = localStorage.getItem('researchSessions');
        return sessions ? JSON.parse(sessions) : [];
    }

    saveResearchSessions() {
        localStorage.setItem('researchSessions', JSON.stringify(this.researchSessions));
    }

    addResearchSession(session) {
        const newSession = {
            id: Date.now(),
            ...session
        };
        this.researchSessions.unshift(newSession);
        
        // Keep only last 15 sessions
        if (this.researchSessions.length > 15) {
            this.researchSessions = this.researchSessions.slice(0, 15);
        }
        
        this.saveResearchSessions();
        return newSession;
    }
}

// Initialize user settings manager
window.userSettingsManager = new UserSettingsManager();
