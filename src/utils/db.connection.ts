import mongoose from "mongoose";
import { logger } from "./logger";

const DB_URI = process.env.DB_URI ?? "";

class MongoseService {
  private count = 0;
  private mongoseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose = () => mongoose;

  connectWithRetry() {
    logger.info("Attempting MongoDB connection (will retry if needed)");
    logger.info(DB_URI);

    mongoose
      .connect(DB_URI, this.mongoseOptions)
      .then(() => {
        logger.info("MongoDB connected");
      })
      .catch((error) => {
        logger.error(error);

        const retrySeconds = 5;
        logger.error(
          `Fail to connect to MongoDB (will retry ${++this
            .count} after ${retrySeconds} seconds): ${error}`
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  }
}

export default new MongoseService();
