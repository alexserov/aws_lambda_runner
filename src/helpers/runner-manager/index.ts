import express from 'express';
import { RunnerManager, RunnerManagerConfig } from './manager';

const globalKey = 'd6e9a68f-322f-47ea-8660-2aa3c4da9e37';

function initRunnerManager(app: express.Application, config: RunnerManagerConfig) {
  app.set(globalKey, new RunnerManager(app, config));
}

function runnerManager(app: express.Application) {
  return app.get(globalKey);
}

export default RunnerManager;
export { initRunnerManager, runnerManager };
