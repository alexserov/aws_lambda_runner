/* eslint-disable import/prefer-default-export */

import { Octokit } from '@octokit/rest';
import { GH_TOKEN_ELEVATED, ORG_NAME, REPO_NAME } from '../env';

const octokit = new Octokit({
    auth: GH_TOKEN_ELEVATED,
});

export async function getRegistrationToken(): Promise<string> {
    let response;
    if (!ORG_NAME) {
        throw new Error('invalid orgname');
    }
    if (REPO_NAME) {
        response = await octokit.rest.actions.createRegistrationTokenForRepo({ owner: ORG_NAME, repo: REPO_NAME });
    } else {
        response = await octokit.rest.actions.createRegistrationTokenForOrg({ org: ORG_NAME });
    }
    if (response.status >= 200 && response.status < 300) {
        return response.data.token;
    }
    throw new Error(`Token request returned: ${response.status}`);
}
