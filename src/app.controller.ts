import { ServerResponse } from 'http';
import { AppService } from './app.service';
import { sendErrorResponse, sendResponse } from './utils/sendResponse';
import { InternalServerError } from './utils/customErrors';
import { getErrorMessage } from './utils/getErrorMessage';

export class AppController {
  private readonly appService: AppService;

  constructor() {
    this.appService = new AppService();
  }

  getHealthStatus(res: ServerResponse) {
    try {
      const data = this.appService.getHealthStatus();
      sendResponse(res, 200, data);
    } catch (error) {
      sendErrorResponse(res, new InternalServerError(getErrorMessage(error)));
    }
  }

  helloWorld(res: ServerResponse) {
    try {
      const data = this.appService.helloWorld();
      sendResponse(res, 200, data);
    } catch (error) {
      sendErrorResponse(res, new InternalServerError(getErrorMessage(error)));
    }
  }
}
