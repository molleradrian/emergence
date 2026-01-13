// Specialized component functionality

class ComponentInterface {
    constructor() {
        this.setupComponentEventListeners();
    }

    setupComponentEventListeners() {
        // Protocol creation modal
        document.addEventListener('click', (e) => {
            if (e.target.textContent === 'Create Protocol') {
                this.createNewProtocol();
            }
            if (e.target.textContent === 'Start Writing') {
                this.startWritingSession();
            }
            if (e.target.textContent === 'Log Research') {
                this.logResearchEntry();
            }
            if (e.target.textContent === 'Update Progress') {
                this.updateComponentProgress();
            }
        });
    }

    createNewProtocol() {
        const modal = document.querySelector('.modal');
        const protocolName = modal.querySelector('input[type="text"]').value;
        const description = modal.querySelector('textarea').value;

        if (protocolName.trim()) {
            // Create protocol entry
            const protocolData = {
                name: protocolName,
                description: description,
                created: new Date().toISOString(),
                status: 'draft'
            };

            // Add to Aetherium protocols
            if (window.dataManager) {
                window.dataManager.projectData.components.aetherium.protocols++;
                window.dataManager.saveProjectData();
            }

            // Close modal and show success
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);

            this.showSuccessMessage(`Protocol "${protocolName}" created successfully!`);
        }
    }

    startWritingSession() {
        const modal = document.querySelector('.modal');
        const bookSelect = modal.querySelector('select');
        const chapterTitle = modal.querySelector('input[type="text"]').value;

        const selectedBook = bookSelect.value;

        if (chapterTitle.trim()) {
            // Create writing session
            const sessionData = {
                book: selectedBook,
                chapter: chapterTitle,
                startTime: new Date().toISOString(),
                status: 'active'
            };

            // Update book progress
            if (window.dataManager) {
                const bookIndex = parseInt(selectedBook.replace('Book ', '')) - 1;
                window.dataManager.projectData.components.books.books[bookIndex].progress += 5;
                window.dataManager.saveProjectData();
            }

            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);

            this.showSuccessMessage(`Writing session started for ${selectedBook}: ${chapterTitle}`);
        }
    }

    logResearchEntry() {
        const modal = document.querySelector('.modal');
        const topic = modal.querySelector('input[type="text"]').value;
        const findings = modal.querySelector('textarea').value;

        if (topic.trim()) {
            // Log research entry
            const researchEntry = {
                topic: topic,
                findings: findings,
                timestamp: new Date().toISOString(),
                type: 'research'
            };

            // Add activity
            if (window.dataManager) {
                window.dataManager.addActivity({
                    type: 'plus',
                    description: `Logged research: ${topic}`,
                    component: 'research'
                });
            }

            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);

            this.showSuccessMessage(`Research logged: ${topic}`);
        }
    }

    updateComponentProgress() {
        const modal = document.querySelector('.modal');
        const componentSelect = modal.querySelector('select');
        const progressInput = modal.querySelector('input[type="number"]');

        const component = componentSelect.value.toLowerCase().replace(' system', '');
        const progress = parseInt(progressInput.value);

        if (progress >= 0 && progress <= 100) {
            // Update progress
            if (window.dataManager) {
                window.dataManager.updateProgress(component, progress);

                // Update UI
                const progressCards = document.querySelectorAll('.progress-card');
                const cardIndex = ['aetherium', 'books', 'research', 'publishing'].indexOf(component);
                if (cardIndex >= 0 && progressCards[cardIndex]) {
                    const progressFill = progressCards[cardIndex].querySelector('.progress-fill');
                    const progressText = progressCards[cardIndex].querySelector('.progress-text');

                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `${progress}% Complete`;
                }
            }

            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);

            this.showSuccessMessage(`${component} progress updated to ${progress}%`);
        }
    }

    showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;

        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(alert, mainContent.firstChild);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Chart and visualization components
class VisualizationManager {
    constructor() {
        this.charts = {};
        this.setupCharts();
    }

    setupCharts() {
        // Initialize charts when data is available
        setTimeout(() => {
            this.createProgressChart();
            this.createActivityChart();
        }, 1000);
    }

    createProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) {
            // Create canvas if it doesn't exist
            const chartContainer = document.createElement('div');
            chartContainer.innerHTML = '<canvas id="progressChart" width="400" height="200"></canvas>';
            document.querySelector('.dashboard-grid').appendChild(chartContainer);
        }

        if (window.dataManager) {
            const progressData = window.dataManager.getProgressData();

            this.charts.progress = new Chart('progressChart', {
                type: 'doughnut',
                data: {
                    labels: Object.keys(progressData),
                    datasets: [{
                        data: Object.values(progressData),
                        backgroundColor: [
                            '#6c5ce7',
                            '#a29bfe',
                            '#fd79a8',
                            '#00b894'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Project Progress Distribution'
                        }
                    }
                }
            });
        }
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) {
            const chartContainer = document.createElement('div');
            chartContainer.innerHTML = '<canvas id="activityChart" width="400" height="200"></canvas>';
            document.querySelector('.activity-panel').appendChild(chartContainer);
        }

        if (window.dataManager) {
            const activities = window.dataManager.getRecentActivities(7);

            this.charts.activity = new Chart('activityChart', {
                type: 'line',
                data: {
                    labels: activities.map(a => new Date(a.timestamp).toLocaleDateString()),
                    datasets: [{
                        label: 'Activities',
                        data: activities.map((_, i) => activities.length - i),
                        borderColor: '#6c5ce7',
                        backgroundColor: 'rgba(108, 92, 231, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Recent Activity Trend'
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }
}

// File system integration helpers
class FileSystemHelper {
    constructor() {
        this.setupFileOperations();
    }

    setupFileOperations() {
        // Set up file operation buttons and handlers
        document.addEventListener('click', (e) => {
            if (e.target.textContent === 'Export Data') {
                this.exportProjectData();
            }
            if (e.target.textContent === 'Import Data') {
                this.importProjectData();
            }
        });
    }

    async exportProjectData() {
        if (window.dataManager) {
            try {
                const data = await window.dataManager.exportData('json');
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `project-emergence-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();

                URL.revokeObjectURL(url);
                this.showMessage('Project data exported successfully!');
            } catch (error) {
                this.showMessage('Export failed: ' + error.message, 'error');
            }
        }
    }

    async importProjectData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const success = await window.dataManager.importData(text, 'json');

                    if (success) {
                        this.showMessage('Project data imported successfully!');
                        // Refresh the interface
                        if (window.projectEmergence) {
                            window.projectEmergence.updateUI();
                        }
                    } else {
                        this.showMessage('Import failed. Please check file format.', 'error');
                    }
                } catch (error) {
                    this.showMessage('Import failed: ' + error.message, 'error');
                }
            }
        };

        input.click();
    }

    showMessage(message, type = 'success') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(alert, mainContent.firstChild);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Dark mode toggle
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = darkModeToggle.querySelector('i');
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    window.componentInterface = new ComponentInterface();
    window.visualizationManager = new VisualizationManager();
    window.fileSystemHelper = new FileSystemHelper();
    initSidebarNavigation();
    initDarkModeToggle();
});

// Add to creative section initialization
function initCreativeSection() {
    // ... existing code ...
    
    // Initialize writing assistant
    window.writingAssistant.loadBookContent('book1');
    
    // Setup writing assistant UI
    document.getElementById('generate-prompt-btn').addEventListener('click', async () => {
        const category = document.querySelector('.prompt-category.active').dataset.category;
        const level = document.getElementById('consciousness-level').value;
        
        // Generate prompt using writing assistant
        const prompt = await window.writingAssistant.generateSuggestions(
            `Generate a ${category} prompt at ${level} consciousness level`,
            { category, level }
        );
        
        // Display the prompt
        document.getElementById('prompt-output').innerHTML = 
            `<p>${prompt.plotIdeas.basedOnPatterns[0]}</p>`;
    });
}

// Add to consciousness section initialization
function initConsciousnessSection() {
    // ... existing code ...
    
    // Initialize research synthesizer
    window.researchSynthesizer.loadResearchContent();
    
    // Setup research synthesis UI
    document.getElementById('research-synthesis-btn').addEventListener('click', async () => {
        const researchInput = document.getElementById('research-input').value;
        
        // Synthesize research
        const synthesis = await window.researchSynthesizer.synthesizeResearch(researchInput);
        
        // Display the synthesis
        document.getElementById('synthesis-output').innerHTML = 
            `<h4>Key Insights:</h4>
            <ul>${synthesis.keyInsights.map(insight => `<li>${insight}</li>`).join('')}</ul>`;
    });
}

// Initialize sidebar navigation
function initSidebarNavigation() {
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // Remove active class from all buttons
            sidebarBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show target section
            showSection(targetSection);
        });
    });
}

function showSection(section) {
    // Implement logic to show the target section
}
