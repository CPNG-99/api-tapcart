import { IQRUtils } from "../../utils/qr.utils";
import { PurchasePayload } from "./purchase.dto";
import { IPurchaseRepository } from "./purchase.repository";
import { v4 as uuidv4 } from "uuid";

export abstract class IPurchaseService {
  abstract checkoutPurchase(
    payload: PurchasePayload
  ): Promise<{ qrCode: string; purchaseId: string; error: string }>;
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
      throw new Error(`Fail to login: ${error?.message || error}`);
    }
  }
}

export default PurchaseService;
