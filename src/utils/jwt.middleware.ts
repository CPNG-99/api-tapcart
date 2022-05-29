import { Request, Response, NextFunction } from "express";
import { HttpResponse, messageStatus } from "./http.response";
import JwtUtils from "./jwt.utils";
import { logger } from "./logger";

export abstract class IJwtMiddleware {
  abstract validateToken(req: Request, res: Response, next: NextFunction): void;
}

class JwtMiddleware {
  validateToken(req: Request, res: Response, next: NextFunction) {
    let response: HttpResponse<null>;
    try {
      const authorization = req.headers["authorization"]?.split(" ");
      if (authorization && authorization[0] !== "Bearer") {
        response = {
          code: 403,
          message: messageStatus[403],
          error: "invalid authorization header: missing Bearer token",
          data: null,
        };

        res.status(response.code).json(response);
      } else {
        if (authorization && authorization[1]) {
          new JwtUtils().verifyToken(authorization[1]);
          next();
        } else {
          throw new Error("missing access token");
        }
      }
    } catch (error: any) {
      let response: HttpResponse<null>;
      logger.warn(error?.message || error);
      response = {
        code: 401,
        message: messageStatus[401],
        error: error?.message || "invalid access token",
        data: null,
      };
      res.status(response.code).json(response);
    }
  }
}

export default JwtMiddleware;
