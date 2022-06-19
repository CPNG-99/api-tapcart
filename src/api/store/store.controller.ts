import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { StoreDTO, UpdateStoreDTO } from "./store.dto";
import { IStoreService } from "./store.service";

export abstract class IStoreController {
  abstract getStoreDetail(
    storeId: string
  ): Promise<HttpResponse<StoreDTO | null>>;
  abstract updateStore(
    storeId: string,
    payload: UpdateStoreDTO
  ): Promise<HttpResponse<null>>;
}

class StoreController implements IStoreController {
  service: IStoreService;

  constructor(service: IStoreService) {
    this.service = service;
  }

  async getStoreDetail(
    storeId: string
  ): Promise<HttpResponse<StoreDTO | null>> {
    try {
      const resp = await this.service.getStoreDetail(storeId);
      return {
        code: resp.statusCode,
        message: messageStatus[resp.statusCode],
        error: resp.error,
        data: resp.data,
      };
    } catch (error: any) {
      logger.error(error?.message || error);
      return {
        code: 500,
        message: messageStatus[500],
        error: error?.message || error,
        data: null,
      };
    }
  }

  async updateStore(
    storeId: string,
    payload: UpdateStoreDTO
  ): Promise<HttpResponse<null>> {
    try {
      const { error } = await this.service.updateStore(storeId, payload);
      return {
        code: !error ? 200 : 400,
        message: messageStatus[!error ? 200 : 400],
        error,
        data: null,
      };
    } catch (error: any) {
      logger.error(error?.message || error);
      return {
        code: 500,
        message: messageStatus[500],
        error: error?.message || error,
        data: null,
      };
    }
  }
}

export default StoreController;
