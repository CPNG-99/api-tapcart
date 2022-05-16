import { IStoreRepository } from "../store/store.repository";
import { RegisterDTO } from "./auth.dto";

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
      await this.repository.save({ _id: "testId", ...payload });
    } catch (error: any) {
      throw new Error(`Fail to register store ${error?.message || error}`);
    }
  }
}

export default AuthService;
