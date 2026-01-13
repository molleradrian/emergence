// Data management and file system integration

class DataManager {
    constructor() {
        this.projectData = {};
        this.lastSync = null;
        this.autoSyncInterval = 5 * 60 * 1000; // 5 minutes
        this.setupAutoSync();
        this.loadProjectData();
    }

    async loadProjectData() {
        try {
            // In a real implementation, this would read from the file system
            // For now, we'll use localStorage and simulate file system access

            const data = localStorage.getItem('projectEmergence_data');
            if (data) {
                this.projectData = JSON.parse(data);
            } else {
                this.projectData = this.getDefaultData();
            }

            this.lastSync = new Date();
            return this.projectData;
        } catch (error) {
            console.error('Error loading project data:', error);
            return this.getDefaultData();
        }
    }

    async saveProjectData(data = null) {
        try {
            const dataToSave = data || this.projectData;
            localStorage.setItem('projectEmergence_data', JSON.stringify(dataToSave));
            this.lastSync = new Date();
            return true;
        } catch (error) {
            console.error('Error saving project data:', error);
            return false;
        }
    }

    getDefaultData() {
        return {
            metadata: {
                version: '1.0.0',
                lastModified: new Date().toISOString(),
                projectName: 'Project Emergence'
            },
            progress: {
                aetherium: 65,
                books: 40,
                research: 80,
                publishing: 25,
                overall: 52
            },
            components: {
                aetherium: {
                    protocols: 8,
                    simulations: 3,
                    integrations: 5,
                    status: 'active'
                },
                books: {
                    series: 'I Am Breathe',
                    books: [
                        { id: 1, title: 'Book 1', status: 'planning', progress: 30 },
                        { id: 2, title: 'Book 2', status: 'outlining', progress: 10 },
                        { id: 3, title: 'Book 3', status: 'concept', progress: 5 }
                    ]
                },
                research: {
                    areas: 8,
                    projects: 5,
                    connections: 12,
                    synthesis: 3
                }
            },
            activities: [
                {
                    id: 1,
                    type: 'edit',
                    description: 'Updated Aetherium protocol template',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    component: 'aetherium'
                },
                {
                    id: 2,
                    type: 'plus',
                    description: 'Added new research connection mapping',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    component: 'research'
                },
                {
                    id: 3,
                    type: 'check',
                    description: 'Completed book series outline template',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    component: 'books'
                }
            ],
            milestones: [
                { id: 1, name: 'Complete project infrastructure', completed: true, date: '2024-01-15' },
                { id: 2, name: 'Research integration framework', completed: true, date: '2024-01-20' },
                { id: 3, name: 'Aetherium System core functionality', completed: false, targetDate: '2024-02-15' }
            ]
        };
    }

    async updateProgress(component, progress) {
        this.projectData.progress[component] = progress;
        this.projectData.metadata.lastModified = new Date().toISOString();

        // Recalculate overall progress
        const components = Object.values(this.projectData.progress);
        this.projectData.progress.overall = Math.round(components.reduce((a, b) => a + b, 0) / components.length);

        await this.saveProjectData();
        return this.projectData;
    }

    async addActivity(activity) {
        const newActivity = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...activity
        };

        this.projectData.activities.unshift(newActivity);
        this.projectData.metadata.lastModified = new Date().toISOString();

        // Keep only last 50 activities
        if (this.projectData.activities.length > 50) {
            this.projectData.activities = this.projectData.activities.slice(0, 50);
        }

        await this.saveProjectData();
        return newActivity;
    }

    async updateMilestone(milestoneId, updates) {
        const milestone = this.projectData.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            Object.assign(milestone, updates);
            this.projectData.metadata.lastModified = new Date().toISOString();
            await this.saveProjectData();
            return milestone;
        }
        return null;
    }

    async exportData(format = 'json') {
        switch(format) {
            case 'json':
                return JSON.stringify(this.projectData, null, 2);
            case 'csv':
                return this.convertToCSV(this.projectData);
            case 'markdown':
                return this.convertToMarkdown(this.projectData);
            default:
                return JSON.stringify(this.projectData, null, 2);
        }
    }

    convertToCSV(data) {
        // Convert project data to CSV format
        let csv = 'Component,Metric,Value\n';

        Object.entries(data.progress).forEach(([component, value]) => {
            csv += `${component},${component} progress,${value}%\n`;
        });

        return csv;
    }

    convertToMarkdown(data) {
        let md = '# Project Emergence - Data Export\n\n';

        md += '## Progress Overview\n';
        Object.entries(data.progress).forEach(([component, value]) => {
            md += `- **${component}**: ${value}%\n`;
        });

        md += '\n## Recent Activities\n';
        data.activities.slice(0, 10).forEach(activity => {
            md += `- ${activity.description} (${new Date(activity.timestamp).toLocaleDateString()})\n`;
        });

        return md;
    }

    async importData(data, format = 'json') {
        try {
            let importedData;

            switch(format) {
                case 'json':
                    importedData = JSON.parse(data);
                    break;
                case 'csv':
                    importedData = this.parseCSV(data);
                    break;
                default:
                    throw new Error('Unsupported import format');
            }

            // Merge with existing data
            this.projectData = { ...this.projectData, ...importedData };
            await this.saveProjectData();

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    setupAutoSync() {
        setInterval(async () => {
            if (this.lastSync && (new Date() - this.lastSync) > this.autoSyncInterval) {
                console.log('Auto-syncing project data...');
                await this.saveProjectData();
            }
        }, 60000); // Check every minute
    }

    getComponentData(component) {
        return this.projectData.components[component] || {};
    }

    getProgressData() {
        return this.projectData.progress;
    }

    getRecentActivities(limit = 10) {
        return this.projectData.activities.slice(0, limit);
    }

    getActiveMilestones() {
        return this.projectData.milestones.filter(m => !m.completed);
    }

    // File system simulation methods
    async readProjectFile(filePath) {
        // In a real implementation, this would read from the actual file system
        // For now, simulate based on file path
        console.log(`Reading file: ${filePath}`);

        if (filePath.includes('README.md')) {
            return '# Project Emergence\n\nConsciousness Engineering Framework\n';
        }

        if (filePath.includes('Development/Aetherium_System')) {
            return 'Aetherium System development files...\n';
        }

        return 'File content would be loaded from: ' + filePath;
    }

    async writeProjectFile(filePath, content) {
        // In a real implementation, this would write to the actual file system
        console.log(`Writing to file: ${filePath}`);
        console.log('Content length:', content.length);

        // Simulate file system write
        return true;
    }

    async listProjectDirectory(dirPath) {
        // Simulate directory listing
        const mockFiles = {
            'Development': ['Aetherium_System', 'Book_Series', 'Research_Integration', 'Project_Management', 'Publishing'],
            'Development/Aetherium_System': ['README.md', 'ADVANCED_FRAMEWORK.md', 'src', 'prompts'],
            'Development/Book_Series': ['SERIES_OVERVIEW.md', 'DEVELOPMENT_GUIDE.md', 'manuscripts'],
            'Project_Emergence_Organized': ['01_Aetherium_System', '02_I_Am_Breathe_Book_Series', '03_Research_Documents']
        };

        return mockFiles[dirPath] || [];
    }
}

// Initialize data manager
document.addEventListener('DOMContentLoaded', () => {
    window.dataManager = new DataManager();
});
