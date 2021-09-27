import express from 'express';
import { data } from './data';

// eslint-disable-next-line no-unused-vars
function handleEvent(req: express.Request, res: express.Response): void {
  // eslint-disable-next-line prefer-destructuring
  const body: data = req.body;
  if (body.action === 'queued') {
    console.log(JSON.stringify(req.body, null, 2));
  }
}

export default { workflow_job: handleEvent };
