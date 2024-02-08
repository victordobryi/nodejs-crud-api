import { IncomingMessage, ServerResponse } from 'http';
import { AppService } from './app.service';
import { sendErrorResponse, sendResponse } from './utils/sendResponse';
import { InternalServerError } from './utils/customErrors';

/* TODO:
  1) remove code duplicate (create function, that handle error)
*/

export class AppController {
  private readonly appService: AppService;

  constructor() {
    this.appService = new AppService();
  }

  getHealthStatus(req: IncomingMessage, res: ServerResponse) {
    try {
      const message = this.appService.getHealthStatus();
      sendResponse(res, 200, { message });
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(res, new InternalServerError(error.message));
      } else {
        sendErrorResponse(res, new InternalServerError());
      }
    }
  }

  helloWorld(req: IncomingMessage, res: ServerResponse) {
    try {
      const message = this.appService.helloWorld();
      sendResponse(res, 200, { message });
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(res, new InternalServerError(error.message));
      } else {
        sendErrorResponse(res, new InternalServerError());
      }
    }
  }
}
