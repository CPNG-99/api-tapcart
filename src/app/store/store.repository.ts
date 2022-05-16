import { RegisterDTO } from "./store.dto";
import MongooseService from "../../utils/db.connection";

export abstract class IStoreRepository {
  abstract save(store: RegisterDTO): Promise<void>;
}

class StoreRepository implements IStoreRepository {
  Schema = MongooseService.getMongoose().Schema;
  storeSchema = new this.Schema({
    _id: String,
    email: String,
    password: String,
    storeName: String,
    storeAddress: String,
    storeDescription: { type: String, select: false },
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
      throw new Error(`Fail to register store ${error?.message || error}`);
    }
  }
}

export default StoreRepository;
