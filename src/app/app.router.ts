import { IncomingMessage, ServerResponse } from 'http';
import { AppController } from './app.controller';
import { sendErrorResponse } from '../utils/sendResponse';
import { BadRequestError, NotFoundError } from '../utils/customErrors';
import { Methods, Routes } from '../types/request.interface';

const appController = new AppController();

export const appRouter = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  if (!url || !method) {
    return sendErrorResponse(res, new BadRequestError());
  }

  if (url === Routes.BASIC && method === Methods.GET) {
    return appController.helloWorld(res);
  } else if (url === Routes.HEALTH && method === Methods.GET) {
    return appController.getHealthStatus(res);
  } else {
    return sendErrorResponse(
      res,
      new NotFoundError('Sorry, the page you are looking for does not exist.')
    );
  }
};
