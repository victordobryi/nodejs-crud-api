import { IncomingMessage, ServerResponse } from 'http';
import { sendErrorResponse } from './sendResponse';
import { InternalServerError } from './customErrors';

export const getPostBody = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      body = body ? JSON.parse(body) : {};
    });

    return JSON.parse(body);
  } catch (error) {
    sendErrorResponse(res, new InternalServerError());
  }
};
