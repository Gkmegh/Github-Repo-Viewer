document.addEventListener('DOMContentLoaded', function () {
    fetchRepositories();
});

const apiUrl = 'https://api.github.com/users/';
const defaultPerPage = 10;
const maxPerPage = 100;
let repositories = [];

let currentPage = 1;
let perPage = defaultPerPage;

// function to show loader 

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

// function to hide loader 

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}


// function to fetch the github repositories 

function fetchRepositories() {
    const username = 'johnpapa'; // Replace with the desired GitHub username
    const totalRepositories = 100;
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${totalRepositories}`;
    // const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;

    showLoader();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            hideLoader();

            const totalPages = Math.ceil(totalRepositories / perPage);
            const startIndex = (currentPage - 1) * perPage;
            const endIndex = Math.min(currentPage * perPage, totalRepositories);

            const repositories = data.slice(startIndex, endIndex);

            renderRepositories(repositories);
            renderPagination(totalPages);
            console.log(data)
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            alert('Failed to fetch repositories');
            hideLoader();
        });
}


// function for display the fetched repositories data to the UI

function renderRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositories');
    repositoriesContainer.innerHTML = '';

    repositories.forEach(repo => {
        const repoTopics = repo.topics.map(topic => `<span class="topic">${topic}</span>`).join(' ');
        // const repoTopics = repo.topics ? repo.topics.slice(0, 2).join(', ') : 'No Topic available';
        const repoHtml = `
            <div class="repository">
                <h2>${repo.name.slice(0,30)}..</h2>
                <p>${repo.description ? repo.description.slice(0, 100) : 'No description available'}</p>
                <p class="Language-topics">${repoTopics}</p>
            </div>
        `;
        repositoriesContainer.insertAdjacentHTML('beforeend', repoHtml);
    });
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const paginationHtml = '<ul class="pagination"></ul>';
    paginationContainer.insertAdjacentHTML('beforeend', paginationHtml);

    const paginationList = document.querySelector('.pagination');

    const prevHtml = `<li class="page-item page-link" data-page="prev"><<</li>`;
    paginationList.insertAdjacentHTML('beforeend', prevHtml);

    for (let i = 1; i <= totalPages; i++) {
        const pageHtml = `<li class="page-item page-link" data-page="${i}">${i}</li>`;
        paginationList.insertAdjacentHTML('beforeend', pageHtml);
    }

    const nextHtml = `<li class="page-item page-link" data-page="next">>></li>`;
    paginationList.insertAdjacentHTML('beforeend', nextHtml);

    paginationList.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('page-link')) {
            const action = target.dataset.page;

            if (action === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (action === 'next' && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(action)) {
                currentPage = parseInt(action);
            }

            fetchRepositories();
        }
    });

    // Add 'active' class to the current page
    const currentPageElement = paginationList.querySelector(`[data-page="${currentPage}"]`);
    if (currentPageElement) {
        currentPageElement.classList.add('active');
    }
}
