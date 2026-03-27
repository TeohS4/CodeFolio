import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../../interfaces/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://localhost:7026/api/contact';

  constructor(private http: HttpClient) { }

  sendContactMessage(data: ContactMessage): Observable<any> {
    const payload = { to: 'weijieteoh26@gmail.com', ...data };
    return this.http.post(this.apiUrl, payload);
    
  }
}