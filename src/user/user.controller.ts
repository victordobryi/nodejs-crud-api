import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from './user.service';
import { sendErrorResponse, sendResponse } from '../utils/sendResponse';
import { InternalServerError, NotFoundError } from '../utils/customErrors';
import { User, UserErrors } from './user.interface';
import { getPostBody } from '../utils/getPostBody';

/* TODO:
  1) add error.message to sendErrorResponse function
  2) add body validation function
*/

export class UserController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: IncomingMessage, res: ServerResponse) {
    try {
      const users = this.userService.getAllUsers();
      sendResponse(res, 200, { data: users });
    } catch (error) {
      sendErrorResponse(res, new NotFoundError(UserErrors.USERS_NOT_FOUND));
    }
  }

  async getUserById(req: IncomingMessage, res: ServerResponse, userId: string) {
    try {
      const user = this.userService.getUserById(userId);
      sendResponse(res, 200, { data: user });
    } catch (error) {
      sendErrorResponse(res, new NotFoundError(UserErrors.USER_NOT_FOUND));
    }
  }

  async createUser(req: IncomingMessage, res: ServerResponse) {
    try {
      const body: User = await getPostBody(req, res);
      const newUser = await this.userService.createUser(body);
      sendResponse(res, 200, { data: newUser });
    } catch (error) {
      sendErrorResponse(res, new InternalServerError());
    }
  }

  async updateUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    try {
      const body: User = await getPostBody(req, res);
      const updatedUser = await this.userService.updateUser(userId, body);
      sendResponse(res, 200, { data: updatedUser });
    } catch (error) {
      sendErrorResponse(res, new InternalServerError());
    }
  }

  async deleteUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    try {
      this.userService.deleteUser(userId);
      sendResponse(res, 204, { data: null });
    } catch (error) {
      sendErrorResponse(res, new NotFoundError(UserErrors.USER_NOT_FOUND));
    }
  }
}
