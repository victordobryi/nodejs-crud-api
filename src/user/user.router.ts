import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from '../user/user.controller';
import { Methods, Routes } from '../types/request.interface';
import { sendErrorResponse } from '../utils/sendResponse';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

const userController = new UserController();

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  if (!url || !method) {
    return sendErrorResponse(res, new BadRequestError());
  }

  if (url?.startsWith(Routes.USERS)) {
    const parts = url.split('/');
    const userId = parts[3];

    switch (method) {
      case Methods.GET:
        if (userId) {
          return userController.getUserById(req, res, userId);
        } else {
          return userController.getAllUsers(req, res);
        }
      case Methods.POST:
        return userController.createUser(req, res);
      case Methods.PUT:
        return userController.updateUser(req, res, userId);
      case Methods.DELETE:
        return userController.deleteUser(req, res, userId);
      default:
        return sendErrorResponse(res, new BadRequestError());
    }
  } else {
    return sendErrorResponse(res, new NotFoundError());
  }
};
