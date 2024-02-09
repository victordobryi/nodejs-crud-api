import { ServerResponse } from 'http';
import { BaseError } from './customErrors';

export const sendErrorResponse = (res: ServerResponse, error: BaseError | any) => {
  res.writeHead(error.status || 500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: error.message }));
};

export const sendResponse = <T>(res: ServerResponse, status: number, data: T) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
