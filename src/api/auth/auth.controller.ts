import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { RegisterDTO } from "./auth.dto";
import { IAuthService } from "./auth.service";

export abstract class IAuthController {
  abstract register(
    payload: RegisterDTO
  ): Promise<HttpResponse<null | { qrCode: string }>>;
}
class AuthController implements IAuthController {
  service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  async register(
    payload: RegisterDTO
  ): Promise<HttpResponse<null | { qrCode: string }>> {
    try {
      logger.info(payload);
      const resp = await this.service.register(payload);
      return {
        code: resp.statusCode,
        message: messageStatus[resp.statusCode],
        error: resp.error,
        data: resp.qrCode
          ? {
              qrCode: resp.qrCode,
            }
          : null,
      };
    } catch (error: any) {
      logger.error(error?.message || error);
      return {
        code: 500,
        message: messageStatus[500],
        error: error?.message || error,
        data: null,
      };
    }
  }
}

export default AuthController;
