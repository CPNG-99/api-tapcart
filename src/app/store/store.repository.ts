import { RegisterDTO } from "./store.dto";
import MongooseService from "../../utils/db.connection";
import { logger } from "../../utils/logger";

export abstract class IStoreRepository {
  abstract save(
    store: RegisterDTO
  ): Promise<{ statusCode: number; error: String }>;
}

class StoreRepository implements IStoreRepository {
  Schema = MongooseService.getMongoose().Schema;
  storeSchema = new this.Schema({
    _id: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false, required: true },
    storeName: { type: String, unique: true, required: true },
    storeAddress: { type: String },
    storeDescription: { type: String },
    // qrCode: {
    //   data: { type: Buffer, required: true },
    //   contentType: { type: String, required: true },
    // },
  });

  Store = MongooseService.getMongoose().model<RegisterDTO>(
    "stores",
    this.storeSchema
  );

  async save(
    payload: RegisterDTO
  ): Promise<{ statusCode: number; error: String }> {
    try {
      const registeredEmail = await this.Store.findOne({
        email: payload.email,
      });
      if (registeredEmail) {
        logger.warn("email already registered");
        return { statusCode: 400, error: "email already registered" };
      }

      const registeredStoreName = await this.Store.findOne({
        storeName: payload.storeName,
      });
      if (registeredStoreName) {
        logger.warn("store name already taken");
        return { statusCode: 400, error: "store name already taken" };
      }

      const store = new this.Store(payload);
      await store.save();
      return { statusCode: 201, error: "" };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default StoreRepository;
