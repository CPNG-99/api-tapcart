export interface RegisterDTO {
  _id: String;
  email: String;
  password: String;
  storeName: String;
  storeAddress: String;
  storeDescription: String;
  qrCode: string;
}

export interface StoreDTO {
  storeName: String;
  storeAddress: String;
  storeDescription: String;
  qrCode: string;
}
