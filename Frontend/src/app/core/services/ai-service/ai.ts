import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private http = inject(HttpClient);

  generateSummary(project: any) {

    return this.http.post<any>(
      'https://localhost:7026/api/ai/summary',
      project
    );
  }
}