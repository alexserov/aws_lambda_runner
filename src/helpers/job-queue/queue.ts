import express from 'express';
import { RawJob } from '../../event-handlers/workflow-job/data';

export type JobQueueItem {

}
export class JobQueue {
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
