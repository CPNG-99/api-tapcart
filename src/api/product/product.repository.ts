import { ProductDTO } from "./product.dto";
import MongooseService from "../../utils/db.connection";
import { ProductDAO } from "./product.dao";

export abstract class IProductRepository {
  abstract save(payload: ProductDTO): Promise<{ error: string }>;
  abstract getList(storeId: string): Promise<ProductDTO[]>;
  abstract getById(productId: string): Promise<ProductDTO | null>;
  abstract delete(productId: string): Promise<{ error: string }>;
}

class ProductRepository implements IProductRepository {
  Schema = MongooseService.getMongoose().Schema;
  productSchema = new this.Schema<ProductDAO>({
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
      const existingProduct = await this.Product.findOne<ProductDAO>({
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

  async getList(storeId: string): Promise<ProductDTO[]> {
    try {
      const products = await this.Product.find<ProductDAO>({
        storeId: storeId,
      });
      const resp: ProductDTO[] = [];

      products.map((product) => {
        resp.push({
          id: product._id,
          product_name: product.productName,
          description: product.description,
          image: product.image,
          price: product.price,
          is_available: product.isAvailable,
          store_id: product.storeId,
        });
      });

      return resp;
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async getById(productId: string): Promise<ProductDTO | null> {
    try {
      const product = await this.Product.findById<ProductDAO>(productId);
      if (!product) return null;

      const resp: ProductDTO = {
        id: product._id,
        product_name: product.productName,
        description: product.description,
        image: product.image,
        price: product.price,
        is_available: product.isAvailable,
        store_id: product.storeId,
      };
      return resp;
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async delete(productId: string): Promise<{ error: string }> {
    try {
      const deletedProduct = await this.Product.findById<ProductDAO>(productId);
      if (!deletedProduct) {
        return { error: "no product found with given id" };
      }

      await this.Product.remove({ _id: productId });
      return { error: "" };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default ProductRepository;
