document.addEventListener('DOMContentLoaded', () => {
    const dashboardGrid = document.getElementById('dashboard-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statTotal = document.getElementById('stat-total');
    const statReview = document.getElementById('stat-review');
    const statIngested = document.getElementById('stat-ingested');

    let currentStatus = 'all';
    let searchQuery = '';

    // Function to render the dashboard
    function renderDashboard() {
        dashboardGrid.innerHTML = '';

        const filteredIdeas = NexusData.ideas.filter(idea => {
            const matchesStatus = currentStatus === 'all' || idea.status === currentStatus;
            const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.type.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });

        filteredIdeas.forEach(idea => {
            const card = document.createElement('div');
            card.classList.add('idea-card-summary', 'glassmorphism');

            const statusLabel = idea.status.replace('_', ' ');
            const latestVersion = idea.versions[idea.versions.length - 1].v;

            card.innerHTML = `
                <div class="card-header">
                    <h3>${idea.title}</h3>
                    <span class="status-badge status-${idea.status}">${statusLabel}</span>
                </div>
                <div class="card-body">
                    <p>${idea.description}</p>
                    <div class="card-meta">
                        <span>Type: ${idea.type.replace('_', ' ')}</span>
                        <span>Stage: ${latestVersion}</span>
                    </div>
                </div>
                <a href="nexus_evolution.html?id=${idea.id}" class="view-evolution-btn">View Evolution</a>
            `;

            dashboardGrid.appendChild(card);
        });

        updateStats();
    }

    // Function to update header stats
    function updateStats() {
        statTotal.textContent = NexusData.ideas.length;
        statReview.textContent = NexusData.ideas.filter(i => i.status === 'under_review').length;
        statIngested.textContent = NexusData.ideas.filter(i => i.status === 'ingested').length;
    }

    // Event listeners for filters
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentStatus = button.dataset.status;
            renderDashboard();
        });
    });

    // Event listener for search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderDashboard();
    });

    // Initial render
    renderDashboard();
});
