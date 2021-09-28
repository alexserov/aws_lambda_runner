import express from 'express';
import { JobQueue } from './queue';

const globalKey = '75419979-6766-411c-9e0a-082aa600f442';

function jobQueue(app: express.Application): JobQueue {
    return app.get(globalKey);
}
function initJobQueue(app: express.Application) {
    app.set(globalKey, new JobQueue(app));
}

export default JobQueue;
export { initJobQueue, jobQueue };
