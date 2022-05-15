import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";

import { HttpResponse } from "./utils/http.response";
import { logger, LoggerStream } from "./utils/logger";
import { RoutesConfig } from "./utils/routes.config";
import notFoundController from "./app/notFound/notFound.controller";
import AuthRoutes from "./app/auth/auth.routes";
import AuthController from "./app/auth/auth.controller";
import AuthService from "./app/auth/auth.service";

// server config
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const app = express();
const server = createServer(app);
const port = Number(process.env.PORT) || 8080;
const routes: Array<RoutesConfig> = [];

// auth
const authService = new AuthService();
const authController = new AuthController(authService);
const authRoutes = new AuthRoutes(app, authController);

// middlewares
app.use(cors());
app.use(morgan("combined", { stream: new LoggerStream() }));

// endpoint routes
routes.push(authRoutes);

// 404
app.use((_, res: express.Response) => {
  const response: HttpResponse<null> = notFoundController.notFound();
  res.status(response.code).json(response);
});

server.listen(port, () => {
  logger.info({ message: `server running on port ${port}` });
});
