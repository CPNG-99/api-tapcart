import { StoreDTO, UpdateStoreDTO } from "./store.dto";
import { IStoreRepository } from "./store.repository";

export abstract class IStoreService {
  abstract getStoreDetail(
    storeId: string
  ): Promise<{ statusCode: number; error: string; data: StoreDTO | null }>;
  abstract updateStore(
    storeId: string,
    payload: UpdateStoreDTO
  ): Promise<{ error: string }>;
}

class StoreService implements IStoreService {
  repository: IStoreRepository;

  constructor(repository: IStoreRepository) {
    this.repository = repository;
  }

  async getStoreDetail(
    storeId: string
  ): Promise<{ statusCode: number; error: string; data: StoreDTO | null }> {
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

  async updateStore(
    storeId: string,
    payload: UpdateStoreDTO
  ): Promise<{ error: string }> {
    try {
      return await this.repository.update(storeId, payload);
    } catch (error: any) {
      throw new Error(`fail to get store detail: ${error?.message || error}`);
    }
  }
}
export default StoreService;
