/* =========================================================
   PERSON 2: GITHUB API + ASYNCHRONOUS REQUESTS
   ========================================================= */

/**
 * Fetch repositories for a programming language.
 *
 * GitHub Search API:
 * https://api.github.com/search/repositories
 *
 * This project uses public repositories only.
 * No personal access token is required in browser JavaScript.
 */

async function fetchRepositories(language) {
  // Create the search query
  const query = encodeURIComponent(`language:${language}`);

  // Request up to 100 repositories
  const url = `https://api.github.com/search/repositories?q=${query}&per_page=100`;

  // Send asynchronous request to GitHub API
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  // Check if request failed
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "GitHub rejected the request. You may have reached the API rate limit. Try again later."
      );
    }

    throw new Error(
      `GitHub request failed with status ${response.status}.`
    );
  }

  // Convert response into JSON
  const data = await response.json();

  // Check if repositories were found
  if (!data.items || data.items.length === 0) {
    throw new Error(
      "No repositories were found for this language."
    );
  }

  // Return repository list
  return data.items;
}