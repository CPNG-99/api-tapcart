import { PurchaseDTO } from "./purchase.dto";
import MongooseService from "../../utils/db.connection";
import { checkoutDAO, PurchaseDAO } from "./purchase.dao";
import { IProductRepository } from "../product/product.repository";

export abstract class IPurchaseRepository {
  abstract save(
    payload: PurchaseDTO,
    checkoutQrCode: string
  ): Promise<{ qrCode: string }>;
}

class PurchaseRepository implements IPurchaseRepository {
  productRepository: IProductRepository;

  Schema = MongooseService.getMongoose().Schema;
  purchaseSchema = new this.Schema<PurchaseDAO>({
    _id: String,
    productName: { type: String, required: true, unique: true },
    description: String,
    image: String,
    price: Number,
    isAvailable: { type: Boolean, required: true },
    storeId: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchaseId: { type: String, required: true },
  });

  checkoutSchema = new this.Schema<checkoutDAO>({
    _id: String,
    qrCode: { type: String, required: true, unique: true },
  });

  Purchase = MongooseService.getMongoose().model<PurchaseDAO>(
    "purchases",
    this.purchaseSchema
  );

  Checkout = MongooseService.getMongoose().model<checkoutDAO>(
    "checkout",
    this.checkoutSchema
  );

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async save(
    payload: PurchaseDTO,
    checkoutQrCode: string
  ): Promise<{ qrCode: string }> {
    try {
      payload.products.forEach(async ({ quantity, product_id }) => {
        const product = await this.productRepository.getById(product_id);
        if (!product) return;

        const purchasedProduct = new this.Purchase({
          _id: product.id,
          productName: product.product_name,
          description: product.description,
          image: product.image,
          price: product.price,
          isAvailable: product.is_available,
          storeId: product.store_id,
          quantity: quantity,
          purchaseId: payload.purchase_id,
        });
        await purchasedProduct.save();
      });

      const checkout = new this.Checkout({
        _id: payload.purchase_id,
        qrCode: checkoutQrCode,
      });
      await checkout.save();

      return { qrCode: checkoutQrCode };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default PurchaseRepository;
