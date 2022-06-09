import { Application, NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { HttpResponse, messageStatus } from "../../utils/http.response";
import { IJwtMiddleware } from "../../utils/jwt.middleware";
import { RoutesConfig } from "../../utils/routes.config";
import { IAuthController } from "./auth.controller";

class AuthRoutes extends RoutesConfig {
  controller: IAuthController;
  middleware: IJwtMiddleware;

  constructor(
    app: Application,
    controller: IAuthController,
    middleware: IJwtMiddleware
  ) {
    super(app, "AuthRoutes");
    this.controller = controller;
    this.middleware = middleware;
  }

  configureRoutes(): Application {
    this.app
      .route("/auth/v1/register")
      .post(
        body("email").isEmail(),
        body("password").isLength({ min: 8, max: 200 }),
        body("store_name").isLength({ min: 3, max: 200 }),
        body("store_address").isLength({ min: 3, max: 200 }),
        body("description").isLength({ max: 200 }),
        async (req: Request, res: Response) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const errorParams: String[] = [];
            errors.array().map((error) => errorParams.push(error.param));

            const resp: HttpResponse<null> = {
              code: 400,
              message: messageStatus[400],
              error: `[${errorParams}]`,
              data: null,
            };
            return res.status(400).json(resp);
          }

          const payload = req.body;
          const resp = await this.controller.register(payload);
          res.status(resp.code).json(resp);
        }
      );

    this.app
      .route("/auth/v1/login")
      .post(body("email").isEmail(), async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorParams: String[] = [];
          errors.array().map((error) => errorParams.push(error.param));

          const resp: HttpResponse<null> = {
            code: 400,
            message: messageStatus[400],
            error: `[${errorParams}]`,
            data: null,
          };
          return res.status(400).json(resp);
        }

        const payload = req.body;
        const resp = await this.controller.login(payload);
        res.status(resp.code).json(resp);
      });

    this.app
      .route("/api/v1/users")
      .all((req: Request, res: Response, next: NextFunction) =>
        this.middleware.validateToken(req, res, next)
      )
      .get(async (_: Request, res: Response) => {
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
        const resp = await this.controller.getUserInfo(storeId);
        res.status(resp.code).json(resp);
      });

    return this.app;
  }
}

export default AuthRoutes;
