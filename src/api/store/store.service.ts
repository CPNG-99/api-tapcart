import { StoreDTO } from "./store.dto";
import { IStoreRepository } from "./store.repository";

export abstract class IStoreService {
  abstract getStoreDetail(
    storeId: String
  ): Promise<{ statusCode: number; error: String; data: StoreDTO | null }>;
}

class StoreService implements IStoreService {
  repository: IStoreRepository;

  constructor(repository: IStoreRepository) {
    this.repository = repository;
  }

  async getStoreDetail(
    storeId: String
  ): Promise<{ statusCode: number; error: String; data: StoreDTO | null }> {
    try {
      const resp = await this.repository.getById(storeId);
      return {
        statusCode: !resp.error ? 200 : 400,
        error: resp.error,
        data: resp.data,
      };
    } catch (error: any) {
      throw new Error(`fail to get store detail: ${error?.message || error}`);
    }
  }
}
export default StoreService;
