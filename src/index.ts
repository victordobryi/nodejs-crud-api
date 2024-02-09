import http from 'http';
import 'dotenv/config';
import { userRouter } from './user/user.router';
import { appRouter } from './app.router';
import { Routes } from './types/request.interface';
import { sendErrorResponse } from './utils/sendResponse';
import { BadRequestError } from './utils/customErrors';

const PORT = process.env.PORT || 5000;

export const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (!url || !method) {
    return sendErrorResponse(res, new BadRequestError());
  }

  const route = `/${url?.split('/')[2]}`;

  if (route === Routes.USERS) {
    userRouter(req, res);
  } else {
    appRouter(req, res);
  }
});

server.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`)
);
