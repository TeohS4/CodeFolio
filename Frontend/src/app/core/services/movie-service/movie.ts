import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Movie {
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'f4e5d2ce0d31c3d0615b8fe947ba8df2';
  private apiUrl = 'https://api.themoviedb.org/3/search/movie';

  constructor(private http: HttpClient) {}

  searchMovies(query: string, limit: number = 8): Observable<Movie[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('language', 'en-US')
      .set('page', '1');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.results.slice(0, limit))
    );
  }
}