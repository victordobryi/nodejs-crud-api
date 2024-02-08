import http from 'http';
import 'dotenv/config';
import { userRouter } from './user/user.router';
import { appRouter } from './app.router';
import { Routes } from './types/request.interface';

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.url?.startsWith(Routes.USERS)) {
    userRouter(req, res);
  } else {
    appRouter(req, res);
  }
});

server.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`)
);
