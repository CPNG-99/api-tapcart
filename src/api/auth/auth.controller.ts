import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import {
  AccessTokenDTO,
  LoginDTO,
  RegisterDTO,
  RegisteredDTO,
} from "./auth.dto";
import { IAuthService } from "./auth.service";

export abstract class IAuthController {
  abstract register(
    payload: RegisterDTO
  ): Promise<HttpResponse<null | RegisteredDTO>>;
  abstract login(
    payload: LoginDTO
  ): Promise<HttpResponse<null | AccessTokenDTO>>;
}
class AuthController implements IAuthController {
  service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  async register(
    payload: RegisterDTO
  ): Promise<HttpResponse<null | RegisteredDTO>> {
    try {
      logger.info(JSON.stringify(payload));
      const resp = await this.service.register(payload);
      return {
        code: resp.statusCode,
        message: messageStatus[resp.statusCode],
        error: resp.error,
        data: resp.qrCode
          ? {
              qr_code: resp.qrCode,
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

  async login(payload: LoginDTO): Promise<HttpResponse<null | AccessTokenDTO>> {
    try {
      logger.info(JSON.stringify(payload));
      const resp = await this.service.login(payload);
      return {
        code: resp.statusCode,
        message: messageStatus[resp.statusCode],
        error: resp.error,
        data: resp.data?.access_token
          ? {
              access_token: resp.data.access_token,
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
