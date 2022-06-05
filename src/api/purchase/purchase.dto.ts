export interface PurchaseDTO {
  purchase_id: string;
  products: [
    {
      quantity: number;
      product_id: string;
    }
  ];
}

export interface PurchasePayload extends Omit<PurchaseDTO, "purchase_id"> {}
