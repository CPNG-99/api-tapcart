export interface RegisterDTO {
  _id: string;
  email: string;
  password: string;
  store_name: string;
  store_address: string;
  store_description: string;
  qr_code: string;
}

export interface LoginDTO {
  _id: string;
  email: string;
  password: string;
}

export interface StoreDTO {
  store_name: string;
  store_address: string;
  store_description: string;
  qr_code: string;
}
