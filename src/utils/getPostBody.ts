import { IncomingMessage, ServerResponse } from 'http';
import { InternalServerError } from './customErrors';
import { getErrorMessage } from './getErrorMessage';

export const getPostBody = async (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve();
    });
    req.on('error', (error) => {
      reject(error);
    });
  });

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new InternalServerError(getErrorMessage(error));
  }
};
