import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { PurchaseDTO } from "./purchase.dto";
import { IPurchaseService } from "./purchase.service";

export abstract class IPurchaseController {
  abstract checkoutPurchase(
    payload: PurchaseDTO
  ): Promise<HttpResponse<{ qrCode: string }>>;
}

class PurchaseController implements IPurchaseController {
  service: IPurchaseService;

  constructor(service: IPurchaseService) {
    this.service = service;
  }

  async checkoutPurchase(
    payload: PurchaseDTO
  ): Promise<HttpResponse<{ qrCode: string }>> {
    try {
      const { qrCode } = await this.service.checkoutPurchase(payload);
      return {
        code: 201,
        message: messageStatus[201],
        error: "",
        data: { qrCode },
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

export default PurchaseController;
