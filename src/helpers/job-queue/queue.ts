/* eslint-disable no-unused-vars */
import express from 'express';
import { RawJob } from '../../event-handlers/workflow-job/data';
import { tVMType, VMType } from '../../known-labels';
import { runnerManager } from '../runner-manager';

export type JobQueueItem = {
    VMType: typeof VMType[number]
}
export class JobQueue {
    private items: Array<JobQueueItem>;

    private app: express.Application;

    constructor(app: express.Application) {
        this.items = [];
        this.app = app;
    }

    add(item: RawJob): void {
        const qi: JobQueueItem = {
            VMType: VMType.filter((x) => item.workflow_job.labels.includes(x))[0] || 'UNUSED',
        };
        this.items.push(qi);
        runnerManager(this.app).requestRunner(qi.VMType);
    }

    update(item: RawJob): void {
        throw new Error('Method not implemented.');
    }

    remove(item: RawJob): void {

    }
}
