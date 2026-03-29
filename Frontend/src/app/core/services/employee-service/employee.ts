import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http-service/http';
import { Employee } from '../../interfaces/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpService) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>('Employee');
  }

  create(emp: Employee) {
    return this.http.post('Employee', emp);
  }

  update(id: number, emp: Employee) {
    return this.http.put(`Employee/${id}`, emp);
  }

  delete(id: number) {
    return this.http.delete('Employee', id);
  }
}