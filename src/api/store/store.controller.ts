import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { StoreDTO } from "./store.dto";
import { IStoreService } from "./store.service";

export abstract class IStoreController {
  abstract getStoreDetail(
    storeId: String
  ): Promise<HttpResponse<StoreDTO | null>>;
}

class StoreController implements IStoreController {
  service: IStoreService;

  constructor(service: IStoreService) {
    this.service = service;
  }

  async getStoreDetail(
    storeId: String
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
}

export default StoreController;
