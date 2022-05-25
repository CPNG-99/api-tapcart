import { RegisterDTO, StoreDTO } from "./store.dto";
import MongooseService from "../../utils/db.connection";
import { logger } from "../../utils/logger";

export abstract class IStoreRepository {
  abstract save(
    store: RegisterDTO
  ): Promise<{ error: String; qrCode: string | null }>;
  abstract getById(
    storeId: String
  ): Promise<{ error: String; data: StoreDTO | null }>;
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
    qrCode: { type: String, required: true, unique: true },
  });

  Store = MongooseService.getMongoose().model<RegisterDTO>(
    "stores",
    this.storeSchema
  );

  async save(
    payload: RegisterDTO
  ): Promise<{ error: String; qrCode: string | null }> {
    try {
      const registeredEmail = await this.Store.findOne({
        email: payload.email,
      });
      if (registeredEmail) {
        logger.warn("email already registered");
        return {
          error: "email already registered",
          qrCode: null,
        };
      }

      const registeredStoreName = await this.Store.findOne({
        storeName: payload.storeName,
      });
      if (registeredStoreName) {
        logger.warn("store name already taken");
        return {
          error: "store name already taken",
          qrCode: null,
        };
      }

      const store = new this.Store(payload);
      await store.save();
      return { error: "", qrCode: payload.qrCode };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async getById(
    storeId: String
  ): Promise<{ error: String; data: StoreDTO | null }> {
    try {
      const store = await this.Store.findOne({
        _id: storeId,
      });

      if (!store) {
        logger.warn(`no store found with id of '${storeId}'`);
        return {
          error: `no store found with id of '${storeId}'`,
          data: null,
        };
      }
      return {
        error: "",
        data: {
          storeName: store.storeName,
          storeAddress: store.storeAddress,
          storeDescription: store.storeDescription,
          qrCode: store.qrCode,
        },
      };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default StoreRepository;
