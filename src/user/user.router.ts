import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from '../user/user.controller';
import { Methods } from '../types/request.interface';
import { sendErrorResponse } from '../utils/sendResponse';
import { BadRequestError } from '../utils/customErrors';

const userController = new UserController();

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  const parts = url!.split('/');
  const userId = parts[3];

  switch (method) {
    case Methods.GET:
      if (userId) {
        return userController.getUserById(res, userId);
      } else {
        return userController.getAllUsers(res);
      }
    case Methods.POST:
      return userController.createUser(req, res);
    case Methods.PUT:
      return userController.updateUser(req, res, userId);
    case Methods.DELETE:
      return userController.deleteUser(res, userId);
    default:
      return sendErrorResponse(res, new BadRequestError());
  }
};
