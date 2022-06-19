import { Application, Request, Response, NextFunction } from "express";
import { HttpResponse, messageStatus } from "../../utils/http.response";
import { IJwtMiddleware } from "../../utils/jwt.middleware";
import { RoutesConfig } from "../../utils/routes.config";
import { IProductController } from "./product.controller";

class ProductRoutes extends RoutesConfig {
  controller: IProductController;
  middleware: IJwtMiddleware;

  constructor(
    app: Application,
    controller: IProductController,
    middleware: IJwtMiddleware
  ) {
    super(app, "ProductRoutes");
    this.controller = controller;
    this.middleware = middleware;
  }

  configureRoutes(): Application {
    this.app
      .route("/api/v1/products")
      .post((req: Request, res: Response, next: NextFunction) =>
        this.middleware.validateToken(req, res, next)
      )
      .post(async (req: Request, res: Response) => {
        const storeId = res.locals.jwt?.["store_id"];
        if (!storeId) {
          const resp: HttpResponse<null> = {
            code: 403,
            message: messageStatus[403],
            error: "Missing jwt signs (store_id)",
            data: null,
          };
          res.status(resp.code).json(resp);
        }
        const payload = req.body;
        const resp = await this.controller.addProduct(payload, storeId);
        res.status(resp.code).json(resp);
      });

    this.app
      .route("/api/v1/products")
      .get(async (req: Request, res: Response) => {
        const storeId = String(req.query?.store_id);
        const resp = await this.controller.getProductList(storeId);
        res.status(resp.code).json(resp);
      });

    this.app
      .route("/api/v1/products/:productId")
      .delete((req: Request, res: Response, next: NextFunction) =>
        this.middleware.validateToken(req, res, next)
      )
      .delete(async (req: Request, res: Response) => {
        const productId = req.params.productId;
        const resp = await this.controller.deleteProduct(productId);
        res.status(resp.code).json(resp);
      });

    this.app
      .route("/api/v1/products/:productId")
      .put((req: Request, res: Response, next: NextFunction) =>
        this.middleware.validateToken(req, res, next)
      )
      .put(async (req: Request, res: Response) => {
        const storeId = res.locals.jwt?.["store_id"];
        if (!storeId) {
          const resp: HttpResponse<null> = {
            code: 403,
            message: messageStatus[403],
            error: "Missing jwt signs (store_id)",
            data: null,
          };
          res.status(resp.code).json(resp);
        }

        const { productId } = req.params;
        const payload = req.body;
        const resp = await this.controller.updateProduct(productId, payload);
        res.status(resp.code).json(resp);
      });

    return this.app;
  }
}

export default ProductRoutes;
