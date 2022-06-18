import { Application, Request, Response } from "express";
import { RoutesConfig } from "../../utils/routes.config";
import { IPurchaseController } from "./purchase.controller";

class PurchaseRoutes extends RoutesConfig {
  controller: IPurchaseController;

  constructor(app: Application, controller: IPurchaseController) {
    super(app, "PurchaseRoutes");
    this.controller = controller;
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

    return this.app;
  }
}

export default PurchaseRoutes;
