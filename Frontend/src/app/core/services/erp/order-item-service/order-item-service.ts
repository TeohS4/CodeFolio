import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrderItem } from '../../../interfaces/order-item.interface';
import { Order } from '../../../interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class OrderItemService {

  private apiUrl = 'https://localhost:7026/api/orderitems';

  constructor(private http: HttpClient) { }

  getByOrder(orderId: number): Observable<OrderItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byorder/${orderId}`).pipe(
      map(items => items.map(i => ({
        id: i.Id,
        orderId: i.orderId,
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
        productName: i.productName
      })))
    );
  }

  getById(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.apiUrl}/${id}`);
  }

  create(item: OrderItem): Observable<void> {
    return this.http.post<void>(this.apiUrl, item);
  }

  update(id: number, item: OrderItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
