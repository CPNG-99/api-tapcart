import { IStoreRepository } from "../store/store.repository";
import { AccessTokenDTO, LoginDTO, RegisterDTO } from "./auth.dto";
import { RegisterDTO as StoreDTO } from "../store/store.dto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { IQRUtils } from "../../utils/qr.utils";
import { IJwtUtils } from "../../utils/jwt.utils";

export abstract class IAuthService {
  abstract register(
    payload: RegisterDTO
  ): Promise<{ statusCode: number; error: string; qrCode: string | null }>;
  abstract login(payload: LoginDTO): Promise<{
    statusCode: number;
    error: string;
    data: AccessTokenDTO | null;
  }>;
}

class AuthService implements IAuthService {
  repository: IStoreRepository;
  qrService: IQRUtils;
  jwt: IJwtUtils;

  constructor(
    repository: IStoreRepository,
    qrService: IQRUtils,
    jwt: IJwtUtils
  ) {
    this.repository = repository;
    this.qrService = qrService;
    this.jwt = jwt;
  }
  async register(
    payload: RegisterDTO
  ): Promise<{ statusCode: number; error: string; qrCode: string | null }> {
    try {
      const uuid = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hashedPassowrd = await bcrypt.hash(payload.password, salt);

      const qrCode = await this.qrService.generateQR(uuid);

      const store: StoreDTO = {
        _id: uuid,
        email: payload.email,
        password: hashedPassowrd,
        store_name: payload.store_name,
        store_address: payload.store_address,
        open_hours: payload.open_hours,
        is_open: false,
        qr_code: qrCode,
      };

      const resp = await this.repository.save(store);
      return {
        statusCode: !resp.error ? 201 : 400,
        error: resp.error,
        qrCode: resp.qrCode,
      };
    } catch (error: any) {
      throw new Error(`Fail to register store: ${error?.message || error}`);
    }
  }

  async login(payload: LoginDTO): Promise<{
    statusCode: number;
    error: string;
    data: AccessTokenDTO | null;
  }> {
    try {
      const resp = await this.repository.getByEmail(payload.email);
      if (!resp.data) {
        return {
          statusCode: 400,
          error: resp.error,
          data: null,
        };
      }

      const isValidate = await bcrypt.compare(
        payload.password,
        resp.data.password
      );

      if (!isValidate) {
        return {
          statusCode: 401,
          error: "password doesn't match",
          data: null,
        };
      }

      const token = this.jwt.generateToken({
        store_id: resp.data._id,
        email: resp.data.email,
      });

      return {
        statusCode: 200,
        error: "",
        data: {
          access_token: token,
        },
      };
    } catch (error: any) {
      throw new Error(`Fail to login: ${error?.message || error}`);
    }
  }
}

export default AuthService;
