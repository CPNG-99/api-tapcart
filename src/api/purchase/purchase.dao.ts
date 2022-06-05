import { ProductDAO } from "../product/product.dao";

export interface PurchaseDAO extends ProductDAO {
  quantity: number;
  purchaseId: string;
}

export interface checkoutDAO {
  _id: string;
  qrCode: string;
}
