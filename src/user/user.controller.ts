import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from './user.service';
import { sendErrorResponse, sendResponse } from '../utils/sendResponse';
import { BadRequestError, InternalServerError, NotFoundError } from '../utils/customErrors';
import { User, UserErrors } from './user.interface';
import { getPostBody } from '../utils/getPostBody';
import { getErrorMessage } from '../utils/getErrorMessage';
import { isValidId } from '../utils/isValidId';
import { validateDto } from '../utils/isValidUserBody';
import { UserDto } from './user.dto';

export class UserController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  private async getUserOrThrowError(userId: string): Promise<User> {
    if (!isValidId(userId)) throw new BadRequestError(UserErrors.NOT_VALID_ID);
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundError(UserErrors.USER_NOT_FOUND);
    return user;
  }

  async getAllUsers(res: ServerResponse) {
    try {
      const users = await this.userService.getAllUsers();
      sendResponse(res, 200, users);
    } catch (error) {
      sendErrorResponse(res, new InternalServerError(getErrorMessage(error)));
    }
  }

  async getUserById(res: ServerResponse, userId: string) {
    try {
      if (!isValidId(userId)) throw new BadRequestError(UserErrors.NOT_VALID_ID);
      const user = await this.getUserOrThrowError(userId);
      if (!user) throw new NotFoundError(UserErrors.USER_NOT_FOUND);
      sendResponse(res, 200, user);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  async createUser(req: IncomingMessage, res: ServerResponse) {
    try {
      const body: User = (await getPostBody(req, res)) as User;
      if (!validateDto(UserDto, body)) throw new BadRequestError(UserErrors.NOT_VALID_BODY);

      const newUser = await this.userService.createUser(body);
      sendResponse(res, 201, newUser);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  async updateUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    try {
      const body = (await getPostBody(req, res)) as User;
      if (!validateDto(UserDto, body, false)) throw new BadRequestError(UserErrors.NOT_VALID_BODY);
      const user = await this.getUserOrThrowError(userId);
      const updatedUser = await this.userService.updateUser(user, body);
      if (!updatedUser) throw new NotFoundError(UserErrors.USER_NOT_FOUND);
      sendResponse(res, 200, updatedUser);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  async deleteUser(res: ServerResponse, userId: string) {
    try {
      await this.getUserOrThrowError(userId);
      await this.userService.deleteUser(userId);
      sendResponse(res, 204, null);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }
}
