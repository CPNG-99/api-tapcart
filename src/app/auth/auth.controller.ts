import { HttpResponse, MessageStatus } from "../../utils/http.response";
import { RegisterDTO } from "./auth.dto";
import { IAuthService } from "./auth.service";

export abstract class IAuthController {
  abstract register(payload: RegisterDTO): Promise<HttpResponse<null>>;
}
class AuthController implements IAuthController {
  service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  async register(payload: RegisterDTO): Promise<HttpResponse<null>> {
    try {
      await this.service.register(payload);
      return {
        code: 201,
        message: MessageStatus.Success,
        error: "",
        data: null,
      };
    } catch (error: any) {
      return {
        code: 500,
        message: MessageStatus.InternalServerError,
        error: error?.message || error,
        data: null,
      };
    }
  }
}

export default AuthController;
