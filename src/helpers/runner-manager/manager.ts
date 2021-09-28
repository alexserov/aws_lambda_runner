import express from 'express';
import {
    access, constants, readFile, unlink, writeFile,
} from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { exec } from 'child_process';
import { HOST_RUNNER_DIR } from '../env';
import { VMType } from '../../known-labels';
import RunnerInstance from './instance';
import { getRegistrationToken, targetUrl } from '../github-api';

const accessAsync = promisify(access);
const existsAsync = (f: string) => accessAsync(f, constants.F_OK).then(() => true).catch(() => false);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

export type RunnerManagerConfig = {
    // eslint-disable-next-line no-unused-vars
    [key in typeof VMType[number]]?: number;
}

export class RunnerManager {
    private app: express.Application;

    private runners: Map<typeof VMType[number], Array<RunnerInstance>>;

    private config: RunnerManagerConfig;

    constructor(app: express.Application, config: RunnerManagerConfig) {
        this.app = app;
        this.config = config;
        this.runners = new Map();
    }

    async init() {
        await this.initRunners();
    }

    private async initRunners(): Promise<void> {
        if (await this.loadCachedRunners()) {
            return;
        }
        const registrationToken = await getRegistrationToken();

        for (let vti = 0; vti < VMType.length; vti++) {
            const type = VMType[vti];
            const maxCount = this.config[type] || 0;
            if (!maxCount) { continue; }
            const array: Array<RunnerInstance> = [];

            // TODO: keep i = 0 for default runner
            for (let i = 1; i <= maxCount; i++) {
                // WARNING: do not convert this to promise.all. We need to reed and remove files synchronously.
                // eslint-disable-next-line no-await-in-loop
                array.push(await this.registerRunner(type, i, registrationToken));
            }
            this.runners.set(type, array);
        }
        await writeFileAsync('.cachedRunners', JSON.stringify(Object.fromEntries(this.runners), null, 2));
    }

    private async registerRunner(type: string, i: number, registrationToken: string): Promise<RunnerInstance> {
        if (!HOST_RUNNER_DIR) {
            throw new Error('HOST_RUNNER_DIR should be defined');
        }
        const scriptName = join(HOST_RUNNER_DIR, 'config.sh');
        if (!(await existsAsync(scriptName))) {
            throw new Error(`GitHub runner does not exist at path ${scriptName}`);
        }

        const args = [
            `--url ${targetUrl}`,
            `--token ${registrationToken}`,
            '--unattended', // no prompts
            '--replace', // overwrite already existing runners (if found)
            `--name sh-${type}-${i}`,
            `--labels ${type}`,
        ].join(' ');

        const execResult = await promisify(exec)(`${scriptName} ${args}`);

        if (execResult.stderr) {
            throw new Error(execResult.stderr);
        }
        const fieldNames = ['.credentials', '.credentials_rsaparams', '.env', '.path', '.runner'] as const;
        const map = await Promise.all(fieldNames.map(async (x) => ({
            key: x,
            value: JSON.parse((await readFileAsync(join(HOST_RUNNER_DIR || '', x))).toString()),
        }))).then((x) => x.reduce((prev, curr) => prev.set(curr.key, curr.value), new Map()));
        await Promise.all(fieldNames.map((x) => unlinkAsync(x)));

        return Object.fromEntries(map);
    }

    private async loadCachedRunners(): Promise<boolean> {
        if (await existsAsync('.cachedRunners')) {
            const data = JSON.parse((await readFileAsync('.cachedRunners')).toString());
            this.runners = new Map(Object.entries(data)) as any;
            return true;
        }
        return false;
    }
}
