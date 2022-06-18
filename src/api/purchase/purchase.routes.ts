import { Application, NextFunction, Request, Response } from "express";
import { IJwtMiddleware } from "../../utils/jwt.middleware";
import { RoutesConfig } from "../../utils/routes.config";
import { IPurchaseController } from "./purchase.controller";

class PurchaseRoutes extends RoutesConfig {
  controller: IPurchaseController;
  middleware: IJwtMiddleware;

  constructor(
    app: Application,
    controller: IPurchaseController,
    middleware: IJwtMiddleware
  ) {
    super(app, "PurchaseRoutes");
    this.controller = controller;
    this.middleware = middleware;
  }

  configureRoutes(): Application {
    this.app
      .route("/api/v1/purchases")
      .post(async (req: Request, res: Response) => {
        const payload = req.body;
        const resp = await this.controller.checkoutPurchase(payload);
        res.status(resp.code).json(resp);
      });

    this.app
      .route("/api/v1/purchases/:purchaseId")
      .delete(async (req: Request, res: Response) => {
        const { purchaseId } = req.params;
        const resp = await this.controller.cancelPurchase(purchaseId);
        res.status(resp.code).json(resp);
      });

    this.app
      .route("/api/v1/purchases/:purchaseId")
      .get((req: Request, res: Response, next: NextFunction) =>
        this.middleware.validateToken(req, res, next)
      )
      .get(async (req: Request, res: Response) => {
        const storeId = res.locals.jwt?.["store_id"];
        const { purchaseId } = req.params;

        const resp = await this.controller.getCheckoutList(storeId, purchaseId);
        res.status(resp.code).json(resp);
      });

    return this.app;
  }
}

export default PurchaseRoutes;
