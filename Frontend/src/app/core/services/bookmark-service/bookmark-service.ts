import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsArticle } from '../../interfaces/news.interface';
import { HttpService } from '../http-service/http';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly endpoint = 'News/bookmark';

  constructor(private httpService: HttpService) {}

  getBookmarks(): Observable<NewsArticle[]> {
    return this.httpService.get<NewsArticle[]>(this.endpoint);
  }

  addBookmark(article: any): Observable<any> {
    return this.httpService.post<any>(this.endpoint, article);
  }

  deleteBookmark(url: string): Observable<any> {
    return this.httpService.delete<any>(this.endpoint, url as any);
  }
}