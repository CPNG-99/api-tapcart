export interface RegisterStoreDTO {
  _id: string;
  email: string;
  password: string;
  store_name: string;
  store_address: string;
  description: string;
  is_open: boolean;
  qr_code: string;
}

export interface LoginDTO {
  _id: string;
  email: string;
  password: string;
}

export interface StoreDTO {
  store_id: string;
  store_name: string;
  store_address: string;
  description: string;
  is_open: boolean;
  qr_code: string;
}
