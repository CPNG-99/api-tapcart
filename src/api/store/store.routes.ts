import { Application, NextFunction, Request, Response } from "express";
import { HttpResponse, messageStatus } from "../../utils/http.response";
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

    this.app
      .route("/api/v1/stores")
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

        const payload = req.body;
        const resp = await this.controller.updateStore(storeId, payload);
        res.status(resp.code).json(resp);
      });

    return this.app;
  }
}

export default StoreRoutes;
