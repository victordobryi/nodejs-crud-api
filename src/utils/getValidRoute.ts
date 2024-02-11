import { IncomingMessage, ServerResponse } from 'http';
import { sendErrorResponse } from './sendResponse';
import { BadRequestError } from './customErrors';

export const getValidRoute = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;
  if (!url || !method) {
    return sendErrorResponse(res, new BadRequestError());
  }

  const route = `/${url?.split('/')[2]}`;

  return route;
};
