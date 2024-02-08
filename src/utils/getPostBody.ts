import { IncomingMessage, ServerResponse } from 'http';
import { sendErrorResponse } from './sendResponse';
import { InternalServerError } from './customErrors';

export const getPostBody = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    return new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          body = body ? JSON.parse(body) : {};
          resolve(body);
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    sendErrorResponse(res, new InternalServerError());
  }
};
