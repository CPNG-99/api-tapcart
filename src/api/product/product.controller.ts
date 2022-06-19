import { HttpResponse, messageStatus } from "../../utils/http.response";
import { logger } from "../../utils/logger";
import { ProductDTO, UpdateProductDTO } from "./product.dto";
import { IProductService } from "./product.service";

export abstract class IProductController {
  abstract addProduct(
    payload: ProductDTO,
    storeId: string
  ): Promise<HttpResponse<null>>;
  abstract getProductList(storeId: string): Promise<HttpResponse<ProductDTO[]>>;
  abstract deleteProduct(productId: string): Promise<HttpResponse<null>>;
  abstract updateProduct(
    productId: string,
    payload: UpdateProductDTO
  ): Promise<HttpResponse<null>>;
}

class ProductController implements IProductController {
  service: IProductService;

  constructor(service: IProductService) {
    this.service = service;
  }

  async addProduct(
    payload: ProductDTO,
    storeId: string
  ): Promise<HttpResponse<null>> {
    try {
      const resp = await this.service.addProduct({
        ...payload,
        store_id: storeId,
      });
      return {
        code: resp.statusCode,
        message: messageStatus[resp.statusCode],
        error: resp.error,
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

  async getProductList(storeId: string): Promise<HttpResponse<ProductDTO[]>> {
    try {
      const products = await this.service.getProductList(storeId);
      return {
        code: 200,
        message: messageStatus[200],
        error: "",
        data: products,
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

  async deleteProduct(productId: string): Promise<HttpResponse<null>> {
    try {
      const resp = await this.service.deleteProduct(productId);
      return {
        code: resp.statusCode,
        message: messageStatus[resp.statusCode],
        error: resp.error,
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

  async updateProduct(
    productId: string,
    payload: UpdateProductDTO
  ): Promise<HttpResponse<null>> {
    try {
      const { error } = await this.service.updateProduct(productId, payload);
      return {
        code: !error ? 200 : 400,
        message: messageStatus[!error ? 200 : 400],
        error,
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
}

export default ProductController;
