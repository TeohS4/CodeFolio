export interface Product {
  id?: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  createdAt?: string | Date; 
  updatedAt?: string | Date;
}