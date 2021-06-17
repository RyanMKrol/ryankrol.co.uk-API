import fs from 'fs';
import { Octokit } from '@octokit/core';

import { PortfolioDataNotFound } from '../../errors';

const USERNAME = 'RyanMKrol';
const CREDENTIALS = JSON.parse(fs.readFileSync(`${__dirname}/../../../../credentials/github.json`));
const PORTFOLIO_CONFIG = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../../configuration/PortfolioData.json`),
);
const GITHUB_CLIENT = new Octokit({
  auth: CREDENTIALS.key,
});

/**
 * Public method for fetching portfolio data for my username
 *
 * @returns {JSON} An API response containing my Github projects
 */
async function getPortfolioData() {
  const rawPortfolioData = await getRawData();
  const data = await extractPortfolioData(rawPortfolioData);

  return data;
}

/**
 * Method to extract data that I think is relevant from the Github API
 *
 * @param {JSON} response The raw Github API response
 * @returns {JSON} An API response containing my github projects
 */
async function extractPortfolioData(response) {
  if (response.status !== 200) {
    throw new PortfolioDataNotFound();
  }

  const filteredData = filterPortfolioData(response.data);

  return Promise.all(
    filteredData.map(async (x) => {
      const { name } = x;
      const lastUpdatedDate = new Date(x.updated_at);
      const lastUpdated = `${lastUpdatedDate.getDate()}/${lastUpdatedDate.getMonth()}/${lastUpdatedDate.getFullYear()}`;
      const commits = await getCommits(name);
      const topics = await getTopics(name);

      return {
        name,
        homepage: x.homepage,
        url: x.html_url,
        lastUpdated,
        language: x.language,
        topics,
        description: x.description,
        commits,
      };
    }),
  );
}

/**
 * Get the topics for a given repo
 *
 * @param {string} repoName The name of the repo to get topics for
 * @returns {Promise<Array<string>>} An array of topics associated with the given repo
 */
async function getTopics(repoName) {
  return GITHUB_CLIENT.request('GET /repos/{owner}/{repo}/topics', {
    repo: repoName,
    owner: USERNAME,
    mediaType: {
      previews: ['mercy'],
    },
  }).then(({ data }) => data.names);
}

/**
 * Get commits for a given repo name
 *
 * @param {string} repoName The name of the repo to get commits for
 * @returns {Promise<number>} The number of commits for this repo
 */
async function getCommits(repoName) {
  return GITHUB_CLIENT.request('GET /repos/{username}/{repo}/contributors', {
    repo: repoName,
    username: USERNAME,
  }).then(({ data }) => data.filter((x) => x.login === USERNAME)[0].contributions);
}

/**
 * Fetch the raw data for a user
 *
 * @returns {Promise<JSON>} Raw API response
 */
async function getRawData() {
  return GITHUB_CLIENT.request('GET /users/{username}/repos?per_page=100', {
    username: USERNAME,
  });
}

/**
 * Reduces the API response to only include the projects I'd like to surface
 *
 * @param {JSON} data The raw API response
 * @returns {JSON} A filtered API response
 */
function filterPortfolioData(data) {
  return data.filter((x) => PORTFOLIO_CONFIG.includeProjectNames.includes(x.name));
}

export default getPortfolioData;
