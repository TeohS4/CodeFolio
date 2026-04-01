export interface Order {
  id?: number;            
  customerId: number;   
  orderDate: string;     
  totalAmount: number; 
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
}