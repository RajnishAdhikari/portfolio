document.addEventListener('DOMContentLoaded', () => {
    // Get the paper ID from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get('id');

    if (paperId) {
        fetchPaperDetails(paperId);
    } else {
        document.body.innerHTML = '<p>No paper ID provided.</p>';
    }
});

async function fetchPaperDetails(id) {
    try {
        const response = await fetch(`/api/papers/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const paper = await response.json();
        populatePaperDetails(paper);
    } catch (error) {
        console.error('Failed to fetch paper details:', error);
        document.body.innerHTML = '<p>Failed to load paper details.</p>';
    }
}

function populatePaperDetails(paper) {
    // Set the page title
    document.title = paper.title;

    // Populate the template elements
    document.getElementById('paper-title').textContent = paper.title;
    document.getElementById('paper-authors').textContent = `Authors: ${paper.authors}`;
    document.getElementById('paper-publication').textContent = `Publication: ${paper.publication}`;
    document.getElementById('paper-description').textContent = paper.long_description;

    const linkContainer = document.getElementById('paper-link');
    linkContainer.innerHTML = ''; // Clear any placeholders

    if (paper.paper_url && paper.paper_url !== '#') {
        const paperButton = document.createElement('button');
        paperButton.className = 'btn btn-color-2';
        paperButton.textContent = 'View Paper';
        paperButton.onclick = () => location.href = paper.paper_url;
        linkContainer.appendChild(paperButton);
    }
}
