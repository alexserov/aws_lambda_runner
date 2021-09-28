import express from 'express';
import { RunnerManager, RunnerManagerConfig } from './manager';

const globalKey = 'd6e9a68f-322f-47ea-8660-2aa3c4da9e37';

async function initRunnerManager(app: express.Application, config: RunnerManagerConfig) {
    const result = new RunnerManager(app, config);
    await result.init();
    app.set(globalKey, result);
}

function runnerManager(app: express.Application) {
    return app.get(globalKey);
}

export default RunnerManager;
export { initRunnerManager, runnerManager };
