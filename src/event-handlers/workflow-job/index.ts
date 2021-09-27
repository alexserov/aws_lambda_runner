import express from 'express';
import { jobQueue } from '../../helpers/job-queue';
import { RawJob } from './data';

// eslint-disable-next-line no-unused-vars
function handleEvent(req: express.Request, res: express.Response): void {
  // eslint-disable-next-line prefer-destructuring
  const body: RawJob = req.body;
  const queue = jobQueue(req.app);
  switch (body.action) {
    case 'queued':
      queue.add(body);
      break;
    case 'in_progress':
      queue.update(body);
      break;
    case 'completed':
      queue.remove(body);
      break;
    default:
      break;
  }
}

export default { workflow_job: handleEvent };
