import express from 'express';

// https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#ping

// eslint-disable-next-line no-unused-vars
function handleEvent(req: express.Request, res: express.Response): void {
  console.log(JSON.stringify(req.body, null, 2));
}

export default { ping: handleEvent };
