import { HttpResponse, MessageStatus } from "../../utils/http.response";
import { IAuthController, IAuthService } from "./auth.dao";
import { AcessTokenDTO } from "./auth.dto";

class AuthController implements IAuthController {
  service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  register(): HttpResponse<AcessTokenDTO | null> {
    try {
      const tokens = this.service.register();
      return {
        code: 200,
        message: "unimplemented",
        error: "",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error: any) {
      return {
        code: 500,
        message: MessageStatus.InternalServerError,
        error: error?.message,
        data: null,
      };
    }
  }
}

export default AuthController;
