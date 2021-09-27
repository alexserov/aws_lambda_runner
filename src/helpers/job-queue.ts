import express from 'express';
import { RawJob } from '../event-handlers/workflow-job/data';

const globalKey = '75419979-6766-411c-9e0a-082aa600f442';

interface JobQueueItem {

}
class JobQueue {
    private items: Array<JobQueueItem>;

    private app: express.Application;

    constructor(app: express.Application) {
      this.items = [];
      this.app = app;
    }

    add(item: RawJob): void {
      const qi: JobQueueItem = {};
      this.items.push(qi);
    }

    update(item: RawJob): void {
      throw new Error('Method not implemented.');
    }

    remove(item: RawJob): void {

    }
}

function jobQueue(app: express.Application): JobQueue {
  return app.get(globalKey);
}
function initJobQueue(app: express.Application) {
  app.set(globalKey, new JobQueue(app));
}

export default JobQueue;
export { initJobQueue, jobQueue };
