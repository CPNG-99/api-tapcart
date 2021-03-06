import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { CheckoutListDTO, PurchaseDTO } from "./purchase.dto";
import { IPurchaseService } from "./purchase.service";

export abstract class IPurchaseController {
  abstract checkoutPurchase(
    payload: PurchaseDTO
  ): Promise<HttpResponse<{ qrCode: string; purchase_id: string | null }>>;
  abstract cancelPurchase(purchaseId: string): Promise<HttpResponse<null>>;
  abstract getCheckoutList(
    storeId: string,
    purchaseId: string
  ): Promise<HttpResponse<CheckoutListDTO>>;
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

  async cancelPurchase(purchaseId: string): Promise<HttpResponse<null>> {
    try {
      const { error } = await this.service.cancelPurchase(purchaseId);
      if (error) {
        return {
          code: 400,
          message: messageStatus[400],
          error: error,
          data: null,
        };
      }
      return {
        code: 200,
        message: messageStatus[200],
        error: "",
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

  async getCheckoutList(
    storeId: string,
    purchaseId: string
  ): Promise<HttpResponse<CheckoutListDTO>> {
    try {
      const { statusCode, data, error } = await this.service.getCheckoutItems(
        storeId,
        purchaseId
      );
      if (error) {
        return {
          code: statusCode,
          message: messageStatus[statusCode],
          error,
          data: null,
        };
      }
      return {
        code: statusCode,
        message: messageStatus[200],
        error: "",
        data,
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
