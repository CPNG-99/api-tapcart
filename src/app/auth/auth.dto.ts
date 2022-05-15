export interface RegisterDTO {
  email: String;
  password: String;
  storeName: String;
  storeAdress: String;
  storeDescription: String;
}

export interface AcessTokenDTO {
  accessToken: String;
  refreshToken: String;
}
