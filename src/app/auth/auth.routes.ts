import { Application, Request, Response } from "express";
import { RoutesConfig } from "../../utils/routes.config";
import { IAuthController } from "./auth.dao";

class AuthRoutes extends RoutesConfig {
  controller: IAuthController;

  constructor(app: Application, controller: IAuthController) {
    super(app, "AuthRoutes");
    this.controller = controller;
  }

  configureRoutes(): Application {
    this.app.route("/auth/v1/register").get((req: Request, res: Response) => {
      const response = this.controller.register();
      res.status(response.code).json(response);
    });

    return this.app;
  }
}

export default AuthRoutes;
