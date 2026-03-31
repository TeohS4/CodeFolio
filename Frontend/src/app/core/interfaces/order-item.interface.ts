import { FormControl } from "@angular/forms";

export interface OrderItem {
  id?: number;          
  orderId: number;       
  productId: number;     
  quantity: number;      
  price: number;
  productName?: string;
}

export interface CartItem extends OrderItem {
  qtyControl: FormControl<number>;
}

