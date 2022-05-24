export interface RegisterDTO {
  email: String;
  password: String;
  store_name: String;
  store_address: String;
  store_description: String;
}

export interface AcessTokenDTO {
  accessToken: String;
  refreshToken: String;
}
