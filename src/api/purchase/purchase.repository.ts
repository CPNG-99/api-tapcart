import { PurchaseDTO } from "./purchase.dto";
import MongooseService from "../../utils/db.connection";
import { CheckoutDAO, CheckoutProductsDAO } from "./purchase.dao";
import { IProductRepository } from "../product/product.repository";

export abstract class IPurchaseRepository {
  abstract save(
    payload: PurchaseDTO,
    checkoutQrCode: string
  ): Promise<{ qrCode: string; error: string }>;
  abstract delete(purchaseId: string): Promise<{ error: string }>;
}

class PurchaseRepository implements IPurchaseRepository {
  productRepository: IProductRepository;

  Schema = MongooseService.getMongoose().Schema;

  checkoutProductSchema = new this.Schema<CheckoutProductsDAO>(
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
    { _id: false }
  );

  checkoutSchema = new this.Schema<CheckoutDAO>({
    _id: String,
    qrCode: { type: String, required: true, unique: true },
    products: [this.checkoutProductSchema],
  });

  Checkout = MongooseService.getMongoose().model<CheckoutDAO>(
    "checkout",
    this.checkoutSchema
  );

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async save(
    payload: PurchaseDTO,
    checkoutQrCode: string
  ): Promise<{ qrCode: string; error: string }> {
    try {
      let isProductsIdValid = true;
      const purchasedProducts: CheckoutProductsDAO[] = [];

      for (const { quantity, product_id } of payload.products) {
        const product = await this.productRepository.getById(product_id);
        if (!product) {
          isProductsIdValid = false;
          break;
        }
        purchasedProducts.push({ productId: product.id, quantity: quantity });
      }

      if (isProductsIdValid) {
        const checkout = new this.Checkout({
          _id: payload.purchase_id,
          qrCode: checkoutQrCode,
          products: purchasedProducts,
        });
        await checkout.save();

        return { qrCode: checkoutQrCode, error: "" };
      }
      return { qrCode: "", error: "invalid product id" };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async delete(purchaseId: string): Promise<{ error: string }> {
    try {
      const deletedPurchase = await this.Checkout.findOne({ _id: purchaseId });
      if (!deletedPurchase) {
        return { error: "no checkout found with given id" };
      }
      await this.Checkout.remove({ _id: purchaseId });
      return { error: "" };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default PurchaseRepository;
