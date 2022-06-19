export interface ProductDTO {
  id: string;
  product_name: string;
  image: string;
  price: number;
  is_available: boolean;
  store_id: string;
}

export interface UpdateProductDTO extends Omit<ProductDTO, "id" | "store_id"> {}
