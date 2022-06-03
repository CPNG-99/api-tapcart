import { ProductDTO } from "./product.dto";
import MongooseService from "../../utils/db.connection";
import { ProductDAO } from "./product.dao";

export abstract class IProductRepository {
  abstract save(payload: ProductDTO): Promise<{ error: string }>;
}

class ProductRepository implements IProductRepository {
  Schema = MongooseService.getMongoose().Schema;
  productSchema = new this.Schema({
    _id: String,
    productName: { type: String, required: true, unique: true },
    description: String,
    image: String,
    price: Number,
    isAvailable: { type: Boolean, required: true },
    storeId: { type: String, required: true },
  });

  Product = MongooseService.getMongoose().model<ProductDAO>(
    "products",
    this.productSchema
  );

  async save(payload: ProductDTO): Promise<{ error: string }> {
    try {
      const existingProduct = await this.Product.findOne({
        productName: payload.product_name,
      });
      if (existingProduct) return { error: "product already exist" };

      const product = new this.Product({
        _id: payload.id,
        productName: payload.product_name,
        description: payload.description,
        image: payload.image,
        price: payload.price,
        isAvailable: payload.is_available,
        storeId: payload.store_id,
      });
      await product.save();

      return { error: "" };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default ProductRepository;
