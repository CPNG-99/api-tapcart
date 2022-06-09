import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { PurchaseDTO } from "./purchase.dto";
import { IPurchaseService } from "./purchase.service";

export abstract class IPurchaseController {
  abstract checkoutPurchase(
    payload: PurchaseDTO
  ): Promise<HttpResponse<{ qrCode: string; purchase_id: string | null }>>;
}

class PurchaseController implements IPurchaseController {
  service: IPurchaseService;

  constructor(service: IPurchaseService) {
    this.service = service;
  }

  async checkoutPurchase(
    payload: PurchaseDTO
  ): Promise<HttpResponse<{ qrCode: string; purchase_id: string | null }>> {
    try {
      const {
        qrCode,
        purchaseId: purchase_id,
        error,
      } = await this.service.checkoutPurchase(payload);
      return {
        code: !error ? 201 : 400,
        message: messageStatus[!error ? 201 : 400],
        error: error,
        data: !error ? { qrCode, purchase_id } : null,
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
