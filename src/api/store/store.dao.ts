export interface StoreDAO {
  _id: string;
  email: string;
  password: string;
  storeName: string;
  storeAddress: string;
  openHours: string;
  isOpen: boolean;
  qrCode: string;
}
