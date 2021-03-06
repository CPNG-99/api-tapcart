import {
  LoginDTO,
  RegisterStoreDTO,
  StoreDTO,
  UpdateStoreDTO,
} from "./store.dto";
import MongooseService from "../../utils/db.connection";
import { logger } from "../../utils/logger";
import { StoreDAO } from "./store.dao";

export abstract class IStoreRepository {
  abstract save(
    store: RegisterStoreDTO
  ): Promise<{ error: string; qrCode: string | null }>;
  abstract getById(
    storeId: string
  ): Promise<{ error: string; data: StoreDTO | null }>;
  abstract getByEmail(
    email: string
  ): Promise<{ error: string; data: LoginDTO | null }>;
  abstract update(
    storeId: string,
    payload: UpdateStoreDTO
  ): Promise<{ error: string }>;
}

class StoreRepository implements IStoreRepository {
  Schema = MongooseService.getMongoose().Schema;
  storeSchema = new this.Schema<StoreDAO>({
    _id: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    storeName: { type: String, unique: true, required: true },
    storeAddress: { type: String },
    image: { type: String },
    openHours: { type: String },
    qrCode: { type: String, required: true, unique: true },
  });

  Store = MongooseService.getMongoose().model<StoreDAO>(
    "stores",
    this.storeSchema
  );

  async save(
    payload: RegisterStoreDTO
  ): Promise<{ error: string; qrCode: string | null }> {
    try {
      const registeredEmail = await this.Store.findOne<StoreDAO>({
        email: payload.email,
      });
      if (registeredEmail) {
        logger.warn("email already registered");
        return {
          error: "email already registered",
          qrCode: null,
        };
      }

      const registeredStoreName = await this.Store.findOne<StoreDAO>({
        storeName: payload.store_name,
      });
      if (registeredStoreName) {
        logger.warn("store name already taken");
        return {
          error: "store name already taken",
          qrCode: null,
        };
      }

      const store = new this.Store({
        _id: payload._id,
        email: payload.email,
        password: payload.password,
        storeName: payload.store_name,
        storeAddress: payload.store_address,
        image: payload.image,
        openHours: payload.open_hours,
        qrCode: payload.qr_code,
      });
      await store.save();
      return { error: "", qrCode: payload.qr_code };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async getById(
    storeId: string
  ): Promise<{ error: string; data: StoreDTO | null }> {
    try {
      const store = await this.Store.findOne<StoreDAO>({
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
          store_id: store._id,
          store_name: store.storeName,
          store_address: store.storeAddress,
          image: store.image,
          open_hours: store.openHours,
          qr_code: store.qrCode,
        },
      };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async getByEmail(
    email: string
  ): Promise<{ error: string; data: LoginDTO | null }> {
    try {
      const store = await this.Store.findOne<StoreDAO>({
        email: email,
      });

      if (!store) {
        logger.warn(`no store found with email of '${email}'`);
        return {
          error: `no store found with email of '${email}'`,
          data: null,
        };
      }
      return {
        error: "",
        data: {
          _id: store._id,
          email: store.email,
          password: store.password,
        },
      };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }

  async update(
    storeId: string,
    payload: UpdateStoreDTO
  ): Promise<{ error: string }> {
    try {
      const updated = await this.Store.findOneAndUpdate<StoreDAO>(
        { _id: storeId },
        {
          storeName: payload.store_name,
          storeAddress: payload.store_address,
          image: payload.image,
          openHours: payload.open_hours,
        }
      );

      if (!updated) return { error: "no store found with given id" };
      return { error: "" };
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default StoreRepository;
