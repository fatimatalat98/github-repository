/* =========================================================
   PERSON 3: APP LOGIC + RANDOM REPOSITORY + UI STATES
   ========================================================= */

const languageSelect = document.getElementById("languageSelect");
const statusBox = document.getElementById("statusBox");
const statusMessage = document.getElementById("statusMessage");
const repositoryCard = document.getElementById("repositoryCard");
const anotherButton = document.getElementById("anotherButton");

const repoLanguage = document.getElementById("repoLanguage");
const repoName = document.getElementById("repoName");
const repoDescription = document.getElementById("repoDescription");
const repoStars = document.getElementById("repoStars");
const repoForks = document.getElementById("repoForks");
const repoIssues = document.getElementById("repoIssues");
const repoLink = document.getElementById("repoLink");

let currentRepositories = [];
let currentRepositoryId = null;

function setInitialState() {
  statusBox.className = "status-box initial";
  statusMessage.textContent = "Select a language to find a repository.";

  repositoryCard.classList.add("hidden");
  anotherButton.classList.add("hidden");
}

function setLoadingState() {
  statusBox.className = "status-box loading";
  statusMessage.textContent = "Loading repositories from GitHub...";

  statusBox.classList.remove("hidden");
  repositoryCard.classList.add("hidden");
  anotherButton.disabled = true;
}

function setErrorState(message) {
  statusBox.className = "status-box error";
  statusMessage.textContent = message;

  statusBox.classList.remove("hidden");
  repositoryCard.classList.add("hidden");
  anotherButton.classList.add("hidden");
}

function setSuccessState(repository) {
  statusBox.classList.add("hidden");
  repositoryCard.classList.remove("hidden");
  anotherButton.classList.remove("hidden");
  anotherButton.disabled = false;

  repoLanguage.textContent = repository.language || languageSelect.value;
  repoName.textContent = repository.full_name;
  repoDescription.textContent =
    repository.description || "This repository does not have a description.";

  repoStars.textContent = formatNumber(repository.stargazers_count);
  repoForks.textContent = formatNumber(repository.forks_count);
  repoIssues.textContent = formatNumber(repository.open_issues_count);

  repoLink.href = repository.html_url;
}

function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

function getRandomRepository(repositories) {
  if (repositories.length === 1) {
    return repositories[0];
  }

  let repository;

  // Avoid showing the same repository twice in a row.
  do {
    const randomIndex = Math.floor(Math.random() * repositories.length);
    repository = repositories[randomIndex];
  } while (repository.id === currentRepositoryId);

  currentRepositoryId = repository.id;
  return repository;
}

async function loadRepositories(language) {
  setLoadingState();

  try {
    currentRepositories = await fetchRepositories(language);
    currentRepositoryId = null;

    const repository = getRandomRepository(currentRepositories);
    setSuccessState(repository);
  } catch (error) {
    console.error(error);
    setErrorState(error.message);
  }
}

languageSelect.addEventListener("change", () => {
  const language = languageSelect.value;

  if (!language) {
    currentRepositories = [];
    currentRepositoryId = null;
    setInitialState();
    return;
  }

  loadRepositories(language);
});

anotherButton.addEventListener("click", () => {
  if (currentRepositories.length === 0) {
    return;
  }

  const repository = getRandomRepository(currentRepositories);
  setSuccessState(repository);
});

setInitialState();
