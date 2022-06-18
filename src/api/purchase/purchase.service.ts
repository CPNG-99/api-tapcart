import { IQRUtils } from "../../utils/qr.utils";
import { CheckoutListDTO, PurchasePayload } from "./purchase.dto";
import { IPurchaseRepository } from "./purchase.repository";
import { v4 as uuidv4 } from "uuid";

export abstract class IPurchaseService {
  abstract checkoutPurchase(
    payload: PurchasePayload
  ): Promise<{ qrCode: string; purchaseId: string; error: string }>;
  abstract cancelPurchase(purchaseId: string): Promise<{ error: string }>;
  abstract getCheckoutItems(
    storeId: string,
    purchaseId: string
  ): Promise<{
    statusCode: number;
    data: CheckoutListDTO | null;
    error: string;
  }>;
}

class PurchaseService implements IPurchaseService {
  repository: IPurchaseRepository;
  qrService: IQRUtils;

  constructor(repository: IPurchaseRepository, qrService: IQRUtils) {
    this.repository = repository;
    this.qrService = qrService;
  }

  async checkoutPurchase(
    payload: PurchasePayload
  ): Promise<{ qrCode: string; purchaseId: string; error: string }> {
    try {
      const uuid = uuidv4();
      const qrCode = await this.qrService.generateQR(uuid);

      const { qrCode: savedQrCode, error } = await this.repository.save(
        { purchase_id: uuid, ...payload },
        qrCode
      );
      return {
        qrCode: !error ? savedQrCode : "",
        purchaseId: !error ? uuid : "",
        error: error,
      };
    } catch (error: any) {
      throw new Error(`Fail checkout: ${error?.message || error}`);
    }
  }

  async cancelPurchase(purchaseId: string): Promise<{ error: string }> {
    try {
      const resp = await this.repository.delete(purchaseId);
      return resp;
    } catch (error: any) {
      throw new Error(`Fail to cancel purchase: ${error?.message || error}`);
    }
  }

  async getCheckoutItems(
    storeId: string,
    purchaseId: string
  ): Promise<{
    statusCode: number;
    data: CheckoutListDTO | null;
    error: string;
  }> {
    try {
      const {
        data,
        storeId: store_id,
        error,
      } = await this.repository.getList(purchaseId);
      if (error) {
        return {
          statusCode: 400,
          data: null,
          error,
        };
      }
      if (storeId !== store_id) {
        return {
          statusCode: 401,
          data: null,
          error: "unauthorized",
        };
      }
      return {
        statusCode: 200,
        data,
        error,
      };
    } catch (error: any) {
      throw new Error(
        `Fail to fetch checkout items: ${error?.message || error}`
      );
    }
  }
}

export default PurchaseService;
