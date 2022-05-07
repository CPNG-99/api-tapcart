import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";

import { IHttpResponse, MessageStatus } from "./utils/httpResponse";
import { logger, LoggerStream } from "./utils/logger";
import winston from "winston";

// server config
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

// middlewares
app.use(cors())
app.use(morgan("combined", { stream: new LoggerStream() }))

app.use((_, res) => {
    const response: IHttpResponse<null> = {
        code: 404,
        message: MessageStatus.BadRequest,
        error: "",
        data: null
    }
    res.status(response.code).json(response);
});

server.listen(port, () => {
    logger.info({message: `server running on port ${port}`});
})

