import 'dotenv/config';
import { availableParallelism } from 'os';
import cluster from 'cluster';
import { createServer } from './server';
import { UserService } from './user/user.service';
import http from 'http';
import url from 'url';
import { MasterInMemoryDB } from './data/masterIMDB';
import { InMemoryDB } from './data/IMDB';

const PORT = Number(process.env.PORT) || 5000;
const parallelismAmount = availableParallelism() - 1;
const db = cluster.isWorker ? new MasterInMemoryDB() : new InMemoryDB();

const service = new UserService(db);
let reqCount = 0;

const getPortNumber = (): number => {
  reqCount = reqCount === parallelismAmount ? 1 : reqCount + 1;

  return PORT + reqCount;
};

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running on port ${PORT}. Waiting for workers to start...`);

  for (let i = 0; i < parallelismAmount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} exited. Starting a new worker...`);
    cluster.fork();
  });

  for (const id in cluster.workers) {
    const worker = cluster.workers[id]!;
    worker.on('message', async (msg) => {
      // @ts-ignore
      if (typeof service[msg.method] === 'function') {
        const parameters = msg.parameters ?? [];
        // @ts-ignore
        const result = await service[msg.method](...parameters);
        worker.send({ method: msg.method, data: result });
      }
    });
  }

  http
    .createServer((req, res) => {
      const { headers, method } = req;
      const balancerPort = getPortNumber();

      console.log(`Proxying request to port ${balancerPort}`);

      const options = {
        ...url.parse(String(req.url)),
        port: balancerPort,
        headers,
        method,
      };

      req.pipe(
        http.request(options, (response) => {
          res.writeHead(response.statusCode!, response.headers);
          response.pipe(res);
        })
      );
    })
    .listen(PORT);
} else {
  const workerPort = Number(PORT) + (cluster.worker?.id || 0);
  const workerServer = createServer();
  workerServer.listen(workerPort, () =>
    console.log(`Worker server is running on port ${workerPort}`)
  );
}
