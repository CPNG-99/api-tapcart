import { Application, Request, Response } from "express";
import { IJwtMiddleware } from "../../utils/jwt.middleware";
import { RoutesConfig } from "../../utils/routes.config";
import { IStoreController } from "./store.controller";

class StoreRoutes extends RoutesConfig {
  controller: IStoreController;
  middleware: IJwtMiddleware;

  constructor(
    app: Application,
    controller: IStoreController,
    middleware: IJwtMiddleware
  ) {
    super(app, "StoreRoutes");
    this.controller = controller;
    this.middleware = middleware;
  }

  configureRoutes(): Application {
    this.app
      .route("/api/v1/stores/:storeId")
      .get(async (req: Request, res: Response) => {
        const storeId = req.params.storeId;
        const resp = await this.controller.getStoreDetail(storeId);
        res.status(resp.code).json(resp);
      });

    return this.app;
  }
}

export default StoreRoutes;
