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
import notFoundController from "./api/notFound/notFound.controller";
import StoreRepository from "./api/store/store.repository";
import AuthService from "./api/auth/auth.service";
import AuthController from "./api/auth/auth.controller";
import AuthRoutes from "./api/auth/auth.routes";
import StoreService from "./api/store/store.service";
import StoreController from "./api/store/store.controller";
import StoreRoutes from "./api/store/store.routes";
import QRUtils from "./utils/qr.utils";
import JwtUtils from "./utils/jwt.utils";
import JwtMiddleware from "./utils/jwt.middleware";
import ProductRoutes from "./api/product/product.routes";
import ProductController from "./api/product/product.controller";
import ProductService from "./api/product/product.service";
import ProductRepository from "./api/product/product.repository";
import PurchaseRepository from "./api/purchase/purchase.repository";
import PurchaseService from "./api/purchase/purchase.service";
import PurchaseController from "./api/purchase/purchase.controller";
import PurchaseRoutes from "./api/purchase/purchase.routes";

// server config
const app = express();
const server = createServer(app);
const port = Number(process.env.PORT) || 8080;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: new LoggerStream() }));

// qr
const qrUtils = new QRUtils();

// jwt
const jwtUtils = new JwtUtils();
const jwtMiddleware = new JwtMiddleware();

// store
const storeRepository = new StoreRepository();
const storeService = new StoreService(storeRepository);
const storeController = new StoreController(storeService);
new StoreRoutes(app, storeController, jwtMiddleware);

// auth
const authService = new AuthService(storeRepository, qrUtils, jwtUtils);
const authController = new AuthController(authService);
new AuthRoutes(app, authController, jwtMiddleware);

// product
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository, storeRepository);
const productController = new ProductController(productService);
new ProductRoutes(app, productController, jwtMiddleware);

// purchase
const purchaseRepository = new PurchaseRepository(productRepository);
const purchaseService = new PurchaseService(purchaseRepository, qrUtils);
const purchaseController = new PurchaseController(purchaseService);
new PurchaseRoutes(app, purchaseController, jwtMiddleware);

// 404
app.use((_, res: express.Response) => {
  const response: HttpResponse<null> = notFoundController.notFound();
  res.status(response.code).json(response);
});

server.listen(port, () => {
  logger.info({ message: `server running on port ${port}` });
});
