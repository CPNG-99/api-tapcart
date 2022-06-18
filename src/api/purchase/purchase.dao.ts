import { ProductDAO } from "../product/product.dao";

export interface PurchaseDAO extends ProductDAO {
  quantity: number;
  purchaseId: string;
}

export interface CheckoutDAO {
  _id: string;
  storeId: string;
  qrCode: string;
  products: CheckoutProductsDAO[];
}

export interface CheckoutProductsDAO {
  productId: string;
  quantity: number;
}
