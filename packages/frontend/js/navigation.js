// Navigation and UI interactions

class NavigationManager {
    constructor() {
        this.setupNavigation();
        this.setupResponsiveNav();
        this.setupKeyboardNavigation();
    }

    setupNavigation() {
        // Handle section switching
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.dataset.section;
                this.switchToSection(section);
            });
        });
    }

    switchToSection(sectionName) {
        // Update active states
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Activate target section
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Announce to screen readers
        this.announceNavigation(sectionName);
    }

    announceNavigation(sectionName) {
        const announcement = `Switched to ${sectionName} section`;
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.className = 'sr-only';
        ariaLive.textContent = announcement;

        document.body.appendChild(ariaLive);
        setTimeout(() => ariaLive.remove(), 1000);
    }

    setupResponsiveNav() {
        // Handle mobile navigation
        const nav = document.querySelector('.nav');

        if (window.innerWidth <= 768) {
            this.createMobileNav();
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.createMobileNav();
            } else {
                this.destroyMobileNav();
            }
        });
    }

    createMobileNav() {
        if (document.querySelector('.mobile-nav')) return;

        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <select class="mobile-nav-select">
                <option value="overview">Overview</option>
                <option value="aetherium">Aetherium</option>
                <option value="books">Books</option>
                <option value="research">Research</option>
                <option value="management">Management</option>
                <option value="publishing">Publishing</option>
            </select>
        `;

        const headerContent = document.querySelector('.header-content');
        headerContent.appendChild(mobileNav);

        // Handle mobile nav changes
        mobileNav.querySelector('.mobile-nav-select').addEventListener('change', (e) => {
            this.switchToSection(e.target.value);
        });
    }

    destroyMobileNav() {
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) mobileNav.remove();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick navigation
            if (e.altKey && e.key >= '1' && e.key <= '6') {
                e.preventDefault();
                const sections = ['overview', 'aetherium', 'books', 'research', 'management', 'publishing'];
                const sectionIndex = parseInt(e.key) - 1;
                if (sections[sectionIndex]) {
                    this.switchToSection(sections[sectionIndex]);
                }
            }
        });
    }
}

// Component interactions
class ComponentManager {
    constructor() {
        this.setupComponentInteractions();
        this.setupModalSystem();
    }

    setupComponentInteractions() {
        // Handle component button clicks
        document.querySelectorAll('.component-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                this.handleComponentAction(action);
            });
        });

        // Handle quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleComponentAction(action) {
        switch(action) {
            case 'Manage Protocols':
                this.showProtocolManager();
                break;
            case 'Run Simulations':
                this.showSimulationRunner();
                break;
            case 'View Integrations':
                this.showIntegrationHub();
                break;
        }
    }

    handleQuickAction(action) {
        // Delegate to main app
        if (window.projectEmergence) {
            window.projectEmergence.handleQuickAction(action);
        }
    }

    setupModalSystem() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                e.target.remove();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.remove();
                }
            }
        });
    }

    showProtocolManager() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Protocol Manager</h2>
                <p>Manage Aetherium System protocols and configurations.</p>
                <button class="component-btn">New Protocol</button>
                <button class="component-btn">View Existing</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.style.display = 'block', 10);
    }

    showSimulationRunner() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Simulation Runner</h2>
                <p>Run consciousness model simulations and view results.</p>
                <button class="component-btn">Start New Simulation</button>
                <button class="component-btn">View Results</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.style.display = 'block', 10);
    }

    showIntegrationHub() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Integration Hub</h2>
                <p>Manage connections between system components.</p>
                <button class="component-btn">Create Integration</button>
                <button class="component-btn">View Connections</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.style.display = 'block', 10);
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
    window.componentManager = new ComponentManager();
});
