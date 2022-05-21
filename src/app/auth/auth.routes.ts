import { Application, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { HttpResponse, MessageStatus } from "../../utils/http.response";
import { RoutesConfig } from "../../utils/routes.config";
import { IAuthController } from "./auth.controller";

class AuthRoutes extends RoutesConfig {
  controller: IAuthController;

  constructor(app: Application, controller: IAuthController) {
    super(app, "AuthRoutes");
    this.controller = controller;
  }

  configureRoutes(): Application {
    this.app
      .route("/auth/v1/register")
      .post(
        body("email").isEmail(),
        body("password").isLength({ min: 8, max: 200 }),
        body("store_name").isLength({ min: 3, max: 200 }),
        body("store_address").isLength({ min: 3, max: 200 }),
        body("store_description").isLength({ max: 200 }),
        async (req: Request, res: Response) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const errorParams: String[] = [];
            errors.array().map((error) => errorParams.push(error.param));

            const response: HttpResponse<null> = {
              code: 400,
              message: MessageStatus.BadRequest,
              error: `[${errorParams}]`,
              data: null,
            };
            return res.status(400).json(response);
          }

          const payload = req.body;
          const response = await this.controller.register(payload);
          res.status(response.code).json(response);
        }
      );

    return this.app;
  }
}

export default AuthRoutes;
