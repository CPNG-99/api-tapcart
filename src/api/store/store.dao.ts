export interface StoreDAO {
  _id: string;
  email: string;
  password: string;
  storeName: string;
  storeAddress: string;
  description: string;
  isOpen: boolean;
  qrCode: string;
}
