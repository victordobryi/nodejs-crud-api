import http from 'http';
import { userRouter } from './user/user.router';
import { appRouter } from './app/app.router';
import { Routes } from './types/request.interface';
import { getValidRoute } from './utils/getValidRoute';

export const createServer = () => {
  const server = http.createServer((req, res) => {
    const route = getValidRoute(req, res);

    if (route === Routes.USERS) {
      userRouter(req, res);
    } else {
      appRouter(req, res);
    }
  });

  return server;
};
