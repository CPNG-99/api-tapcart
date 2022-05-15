import { HttpResponse } from "../../utils/http.response";
import { AcessTokenDTO } from "./auth.dto";

export abstract class IAuthController {
  abstract register(): HttpResponse<AcessTokenDTO | null>;
}

export abstract class IAuthService {
  abstract register(): AcessTokenDTO;
}
