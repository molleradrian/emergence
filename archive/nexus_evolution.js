document.addEventListener('DOMContentLoaded', () => {
    // Data is loaded from nexus_data.js (NexusData object)

    // Get idea ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const ideaId = urlParams.get('id') || "idea_badenhorst_cylinder";

    const idea = NexusData.ideas.find(i => i.id === ideaId) || NexusData.ideas[0];

    document.getElementById('idea-title').textContent = idea.title;

    const timelineContainer = document.querySelector('.timeline');
    const currentVersionTitle = document.getElementById('current-version-title');
    const versionContent = document.getElementById('version-content');
    const galactusReviewPanel = document.getElementById('galactus-review-panel');
    const reviewDetails = galactusReviewPanel.querySelector('.review-details');
    const outputDisplay = document.getElementById('output-display');
    const outputButtons = document.querySelectorAll('.output-btn');

    // Function to render the timeline
    function renderTimeline() {
        timelineContainer.innerHTML = '';
        idea.versions.forEach((version, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.classList.add('timeline-item');
            if (version.isReview) {
                timelineItem.classList.add('review');
            }
            timelineItem.dataset.versionIndex = index;

            const circle = document.createElement('div');
            circle.classList.add('circle');
            timelineItem.appendChild(circle);

            const label = document.createElement('p');
            label.textContent = version.v;
            timelineItem.appendChild(label);

            timelineContainer.appendChild(timelineItem);
        });
    }

    // Function to display version details
    function displayVersionDetails(version) {
        currentVersionTitle.textContent = `${version.v} - ${version.notes}`;
        versionContent.innerHTML = `<p><strong>Date:</strong> ${version.date}</p><p>${version.content}</p>`;

        // Hide Galactus Review panel by default unless it's the review item
        galactusReviewPanel.style.display = 'none';
        if (version.isReview) {
            galactusReviewPanel.style.display = 'block';
            const review = idea.reviews[0]; // Assuming one Galactus review for now
            reviewDetails.innerHTML = `
                <p><strong>Reviewer:</strong> ${review.reviewer}</p>
                <p><strong>Date:</strong> ${review.date}</p>
                <p><strong>Type:</strong> ${review.type}</p>
                <p><strong>Priority:</strong> ${review.priority}</p>
                <h4>Findings:</h4>
                <ul>
                    ${review.findings.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <h4>Recommendations:</h4>
                <ul>
                    ${review.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            `;
        }
        outputDisplay.innerHTML = ''; // Clear output display when changing version
    }

    // Event listener for timeline clicks
    timelineContainer.addEventListener('click', (event) => {
        const item = event.target.closest('.timeline-item');
        if (item) {
            // Remove active class from all items
            document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            const index = parseInt(item.dataset.versionIndex);
            displayVersionDetails(idea.versions[index]);

            // Scroll to Galactus Review panel if it's the review item
            if (idea.versions[index].isReview) {
                galactusReviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // Event listener for output generation buttons
    outputButtons.forEach(button => {
        button.addEventListener('click', () => {
            const track = button.dataset.track;
            outputDisplay.innerHTML = `<p>${idea.output_tracks[track]}</p>`;
        });
    });

    // Initial render
    renderTimeline();
    // Display the latest version by default
    const initialVersionIndex = idea.versions.length - 1;
    timelineContainer.children[initialVersionIndex].classList.add('active');
    displayVersionDetails(idea.versions[initialVersionIndex]);
});
