export interface RegisterDTO {
  email: string;
  password: string;
  store_name: string;
  store_address: string;
  open_hours: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface JwtSignPayload {
  store_id: string;
  email: string;
}

export interface AccessTokenDTO {
  access_token: string;
}

export interface RegisteredDTO {
  qr_code: string;
}
