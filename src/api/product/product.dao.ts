export interface ProductDAO {
  _id: string;
  productName: string;
  image: string;
  price: number;
  isAvailable: boolean;
  storeId: string;
}
