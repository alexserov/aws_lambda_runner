import express from 'express';
import { HOST_RUNNER_DIR } from '../env';
import { VMType } from '../../known-labels';
import RunnerInstance from './instance';
import { getRegistrationToken } from '../github-api';

export type RunnerManagerConfig = {
    // eslint-disable-next-line no-unused-vars
    [key in typeof VMType[number]]: number;
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
        if (this.loadCachedRunners()) {
            return;
        }
        const registrationToken = await getRegistrationToken();

        for (let vti = 0; vti < VMType.length; vti++) {
            const type = VMType[vti];
            const maxCount = this.config[type] || 0;
            if (!maxCount) { continue; }
            const array = [];
            for (let i = 0; i < maxCount; i++) {
                array.push(this.registerRunner(type, i, registrationToken));
            }
            this.runners.set(type, array);
        }
    }

    private registerRunner(type: string, i: number, registrationToken: string): any {
        
        throw new Error('Method not implemented.');
    }

    private loadCachedRunners(): boolean {
        throw new Error('Method not implemented.');
    }
}
