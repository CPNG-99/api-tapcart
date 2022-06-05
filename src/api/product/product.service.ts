import { IStoreRepository } from "../store/store.repository";
import { ProductDTO } from "./product.dto";
import { IProductRepository } from "./product.repository";
import { v4 as uuidv4 } from "uuid";

export abstract class IProductService {
  abstract addProduct(
    payload: ProductDTO
  ): Promise<{ statusCode: number; error: string }>;
  abstract getProductList(storeId: string): Promise<ProductDTO[]>;
}

class ProductService implements IProductService {
  productRepository: IProductRepository;
  storeRepository: IStoreRepository;

  constructor(
    productRepository: IProductRepository,
    storeRepository: IStoreRepository
  ) {
    this.productRepository = productRepository;
    this.storeRepository = storeRepository;
  }

  async addProduct(
    payload: ProductDTO
  ): Promise<{ statusCode: number; error: string }> {
    try {
      const uuid = uuidv4();
      payload.id = uuid;

      const err_validate = await this.isStoreValidated(payload.store_id);
      const { error } = await this.productRepository.save(payload);

      return { statusCode: error ? 400 : 201, error: err_validate || error };
    } catch (error: any) {
      throw new Error(`Fail to login: ${error?.message || error}`);
    }
  }

  async getProductList(storeId: string): Promise<ProductDTO[]> {
    try {
      return await this.productRepository.getList(storeId);
    } catch (error: any) {
      throw new Error(`Fail to login: ${error?.message || error}`);
    }
  }

  private async isStoreValidated(storeId: string): Promise<string> {
    const store = await this.storeRepository.getById(storeId);
    if (!store.data) {
      return "store doesn't exist";
    }
    return "";
  }
}

export default ProductService;
