import { ServerResponse } from 'http';
import { BaseError } from './customErrors';

interface ResponseData<T> {
  data?: T;
  message?: string;
}

export const sendErrorResponse = (res: ServerResponse, error: BaseError) => {
  res.writeHead(error.status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: error.message }));
};

export const sendResponse = <T>(res: ServerResponse, status: number, resData: ResponseData<T>) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  const { message, data } = resData;
  res.end(JSON.stringify({ message, data }));
};
