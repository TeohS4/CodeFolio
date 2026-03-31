import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Customer } from "../../../interfaces/customer.intertface";

@Injectable({ providedIn: 'root' })
export class CustomerService {

  private apiUrl = 'https://localhost:7026/api/Customers';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  create(data: Customer) {
    return this.http.post<Customer>(this.apiUrl, data);
  }

  update(id: number, data: Customer) {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
