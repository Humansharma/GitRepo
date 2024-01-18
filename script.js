function fetchRepositories() {
    const username = document.getElementById('username').value;
    const repositoriesList = document.getElementById('repositories-list');

    // Clear previous results
    repositoriesList.innerHTML = '';

    // Fetch repositories from GitHub API
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repositories => {
            repositories.forEach(repo => {
                const repositoryDiv = document.createElement('div');
                repositoryDiv.classList.add('repository');

                const title = document.createElement('h2');
                title.textContent = repo.name;

                const description = document.createElement('p');
                description.textContent = repo.description || 'No description available.';

                const languages = document.createElement('p');
                languages.textContent = 'Languages: ';

                // Fetch languages for each repository
                fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`)
                    .then(response => response.json())
                    .then(repoLanguages => {
                        // Append each language to the 'Languages' paragraph
                        Object.keys(repoLanguages).forEach(language => {
                            const languageSpan = document.createElement('span');
                            languageSpan.textContent = `${language}, `;
                            languages.appendChild(languageSpan);
                        });

                        // Remove the trailing comma and space
                        languages.lastChild.textContent = languages.lastChild.textContent.slice(0, -2);
                    })
                    .catch(error => {
                        console.error(`Error fetching languages for ${repo.name}:`, error);
                        languages.textContent = 'Languages: N/A';
                    });

                repositoryDiv.appendChild(title);
                repositoryDiv.appendChild(description);
                repositoryDiv.appendChild(languages);
                repositoriesList.appendChild(repositoryDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            repositoriesList.innerHTML = '<p>Error fetching repositories. Please check the username and try again.</p>';
        });
}
