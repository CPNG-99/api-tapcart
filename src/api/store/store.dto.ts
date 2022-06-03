export interface RegisterDTO {
  _id: string;
  email: string;
  password: string;
  store_name: string;
  store_address: string;
  open_hours: string;
  is_open: boolean;
  qr_code: string;
}

export interface LoginDTO {
  _id: string;
  email: string;
  password: string;
}

export interface StoreDTO {
  id: string;
  store_name: string;
  store_address: string;
  open_hours: string;
  is_open: boolean;
  qr_code: string;
}
