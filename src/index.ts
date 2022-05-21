import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";

// load env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import { HttpResponse } from "./utils/http.response";
import { logger, LoggerStream } from "./utils/logger";
import notFoundController from "./app/notFound/notFound.controller";
import StoreRepository from "./app/store/store.repository";
import AuthService from "./app/auth/auth.service";
import AuthController from "./app/auth/auth.controller";
import AuthRoutes from "./app/auth/auth.routes";
import QRService from "./app/qr/qr.service";

// server config
const app = express();
const server = createServer(app);
const port = Number(process.env.PORT) || 8080;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: new LoggerStream() }));

// qr
const qrService = new QRService();

// auth
const storeRepository = new StoreRepository();
const authService = new AuthService(storeRepository, qrService);
const authController = new AuthController(authService);
new AuthRoutes(app, authController);

// 404
app.use((_, res: express.Response) => {
  const response: HttpResponse<null> = notFoundController.notFound();
  res.status(response.code).json(response);
});

server.listen(port, () => {
  logger.info({ message: `server running on port ${port}` });
});
