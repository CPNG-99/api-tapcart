import { RegisterDTO } from "./store.dto";
import MongooseService from "../../utils/db.connection";

export abstract class IStoreRepository {
  abstract save(store: RegisterDTO): Promise<void>;
}

class StoreRepository implements IStoreRepository {
  Schema = MongooseService.getMongoose().Schema;
  storeSchema = new this.Schema({
    _id: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false, required: true },
    storeName: { type: String, required: true },
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

  async save(payload: RegisterDTO): Promise<void> {
    try {
      const store = new this.Store(payload);
      await store.save();
    } catch (error: any) {
      throw new Error(error?.message || error);
    }
  }
}

export default StoreRepository;
