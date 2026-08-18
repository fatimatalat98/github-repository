/* =========================================================
   PERSON 2: GITHUB API + ASYNCHRONOUS REQUESTS
   ========================================================= */

/**
 * Fetch repositories for a programming language.
 *
 * GitHub search endpoint:
 * https://api.github.com/search/repositories
 *
 * This project requests public repositories only, so it does not put a
 * personal access token in browser JavaScript.
 */
async function fetchRepositories(language) {
  const query = encodeURIComponent(`language:${language}`);

  // Ask for up to 100 results, then Person 3 will choose one randomly.
  const url = `https://api.github.com/search/repositories?q=${query}&per_page=100`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "GitHub rejected the request. You may have reached the API rate limit. Try again later."
      );
    }

    throw new Error(`GitHub request failed with status ${response.status}.`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("No repositories were found for this language.");
  }

  return data.items;
}
