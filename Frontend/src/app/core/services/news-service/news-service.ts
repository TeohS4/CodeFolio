import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiKey = 'be06e67a4e314d1d91df02bca884fb8b';
  private baseUrl = 'https://newsapi.org/v2/top-headlines';

  constructor(private http: HttpClient) {}

  getNews(page: number, pageSize: number, category: string, query: string): Observable<any> {
    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('page', page)
      .set('pageSize', pageSize)
      .set('country', 'us');

    if (category) params = params.set('category', category);
    if (query) params = params.set('q', query);

    return this.http.get(this.baseUrl, { params });
  }
}