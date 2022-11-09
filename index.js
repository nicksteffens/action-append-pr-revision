const appendRevision = require('./src/append-revision.js');
const core = require('@actions/core');
const github = require('@actions/github');

const auth = core.getInput('auth');
const repo = core.getInput('repo');
const owner = core.getInput('owner');
const pr = core.getInput('pr');
const url = core.getInput('url');
const packageName = core.getInput('packageName');
const revision = core.getInput('revision');

if (!auth || !repo || !owner || !pr || !url || !packageName || !revision ) {
  core.setFailed('Please provide all arguments');
  return 1;
}

const octokit = github.getOctokit(auth);

async function main() {
  const data = await octokit
    .request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner,
      repo,
      pull_number: pr,
    })
    .then(({ data }) => data)
    .catch((error) => core.error(error));

  if (!data) {
    core.setFailed(`Error while getting PR ${pr}`);
    return 1;
  }

  let { body } = data;

  if (!body) {
    core.info('Pull request has no description, setting it to an empty string');
    body = '';
  }

  let updatedBody = appendRevision(body, url, packageName, revision);

  const updateResponse = await octokit
    .request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner,
      repo,
      pull_number: pr,
      body: updatedBody,
    })
    .catch((error) => core.error(error));

  if (!updateResponse) {
    core.setFailed(`Error while updating PR ${pr}`);
    return 1;
  }
}

main();