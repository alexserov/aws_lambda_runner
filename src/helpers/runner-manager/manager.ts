import express from 'express';
import { GH_TOKEN_ELEVATED, HOST_RUNNER_DIR } from '../env';
import RunnerInstance from './instance';

export interface RunnerManagerConfig {
    maxCount: number;
}

export class RunnerManager {
    private app: express.Application;

    private runners: Array<RunnerInstance>

    private maxCount: number;

    constructor(app: express.Application, config: RunnerManagerConfig) {
      this.app = app;
      this.maxCount = config.maxCount;
      this.initRunners();
    }

    private initRunners(): void {
      if (this.loadCachedRunners()) {
        return;
      }
      const registrationToken = this.getRegistrationToken();
      for (let i = 0; i < this.maxCount; i++) {
        this.runners.push(this.registerRunner(i, registrationToken));
      }
    }
}
