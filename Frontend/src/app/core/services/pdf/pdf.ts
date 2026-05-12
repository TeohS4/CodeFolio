import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PdfService {
  private baseUrl = 'https://localhost:7026/api/pdfai'; 

  constructor(private http: HttpClient) { }

  uploadAndAnalyze(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/analyze`, formData);
  }

  ask(text: string, question: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ask`, { text, question });
  }
  
}
