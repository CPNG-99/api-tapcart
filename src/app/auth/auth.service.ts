import { IStoreRepository } from "../store/store.repository";
import { RegisterDTO } from "./auth.dto";
import { RegisterDTO as StoreDTO } from "../store/store.dto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { IQRService } from "../qr/qr.service";
import { logger } from "../../utils/logger";

export abstract class IAuthService {
  abstract register(
    payload: RegisterDTO
  ): Promise<{ statusCode: number; error: String; qrCode: string | null }>;
}

class AuthService implements IAuthService {
  repository: IStoreRepository;
  qrService: IQRService;

  constructor(repository: IStoreRepository, qrService: IQRService) {
    this.repository = repository;
    this.qrService = qrService;
  }

  async register(
    payload: RegisterDTO
  ): Promise<{ statusCode: number; error: String; qrCode: string | null }> {
    try {
      const uuid = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hashedPassowrd = await bcrypt.hash(
        payload.password.toString(),
        salt
      );

      const jsonData = JSON.stringify(uuid);
      const qrCode = await this.qrService.generateQR(jsonData);

      const store: StoreDTO = {
        _id: uuid,
        email: payload.email,
        password: hashedPassowrd,
        storeName: payload.store_name,
        storeAddress: payload.store_address,
        storeDescription: payload.store_description,
        qrCode: qrCode,
      };

      const resp = await this.repository.save(store);
      return resp;
    } catch (error: any) {
      throw new Error(`Fail to register store: ${error?.message || error}`);
    }
  }
}

export default AuthService;
