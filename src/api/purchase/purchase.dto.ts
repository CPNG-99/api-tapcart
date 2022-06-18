export interface PurchaseDTO {
  purchase_id: string;
  products: [
    {
      quantity: number;
      product_id: string;
    }
  ];
}

export interface CheckoutListDTO {
  total_price: number;
  items: CheckoutProductDTO[];
}

export interface CheckoutProductDTO {
  quantity: number;
  product_name: string;
  image: string;
  price: number;
  is_available: boolean;
}

export interface PurchasePayload extends Omit<PurchaseDTO, "purchase_id"> {}
