import express from 'express';
import handlePing from './event-handlers/ping';
import handleCheckRun from './event-handlers/workflow-job';

// eslint-disable-next-line no-unused-vars
const eventMap: Map<string, ((req: express.Request, res: express.Response) => void)> = new Map([
  ...Object.entries(handlePing),
  ...Object.entries(handleCheckRun),
]);
const app = express();
app.use(express.json());

app.post('/', (req, res): void => {
  const header = req.headers['x-github-event'];
  console.log(header);
  if (typeof header === 'string') {
    const handler = eventMap.get(header);
    if (handler) {
      handler(req, res);
    }
  }
  res.status(403);
});

const port = process.env.PORT || 4567;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
