import { IStoreRepository } from "../store/store.repository";
import { RegisterDTO } from "./auth.dto";
import { RegisterDTO as StoreDTO } from "../store/store.dto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export abstract class IAuthService {
  abstract register(payload: RegisterDTO): Promise<void>;
}

class AuthService implements IAuthService {
  repository: IStoreRepository;

  constructor(repository: IStoreRepository) {
    this.repository = repository;
  }

  async register(payload: RegisterDTO) {
    try {
      const uuid = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hashedPassowrd = await bcrypt.hash(
        payload.password.toString(),
        salt
      );

      const store: StoreDTO = {
        _id: uuid,
        email: payload.email,
        password: hashedPassowrd,
        storeName: payload.store_name,
        storeAddress: payload.store_address,
        storeDescription: payload.store_description,
      };

      await this.repository.save(store);
    } catch (error: any) {
      throw new Error(`Fail to register store: ${error?.message || error}`);
    }
  }
}

export default AuthService;
