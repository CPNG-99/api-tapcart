import { Application, Request, Response } from "express";
import { RoutesConfig } from "../../utils/routes.config";
import { IAuthController } from "./auth.controller";
import { RegisterDTO } from "./auth.dto";

class AuthRoutes extends RoutesConfig {
  controller: IAuthController;

  constructor(app: Application, controller: IAuthController) {
    super(app, "AuthRoutes");
    this.controller = controller;
  }

  configureRoutes(): Application {
    this.app
      .route("/auth/v1/register")
      .get(async (req: Request, res: Response) => {
        const payload: RegisterDTO = {
          email: "",
          password: "",
          storeName: "",
          storeAdress: "",
          storeDescription: "",
        };
        const response = await this.controller.register(payload);
        res.status(response.code).json(response);
      });

    return this.app;
  }
}

export default AuthRoutes;
