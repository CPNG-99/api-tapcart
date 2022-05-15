import { IAuthService } from "./auth.dao";
import { AcessTokenDTO } from "./auth.dto";

class AuthService implements IAuthService {
  register(): AcessTokenDTO {
    throw new Error("Method not implemented.");
  }
}

export default AuthService;
