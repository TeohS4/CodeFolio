import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie, MovieDetails } from '../../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  
  private apiKey = 'f4e5d2ce0d31c3d0615b8fe947ba8df2';
  private apiUrl = 'https://api.themoviedb.org/3/search/movie';
  private detailUrl = 'https://api.themoviedb.org/3';

  // State cache properties to retain data when navigating back
  public cachedMovies: Movie[] = [];
  public cachedQuery: string = '';

  constructor(private http: HttpClient) { }

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

  getMovieDetail(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `${this.detailUrl}/movie/${id}?api_key=${this.apiKey}`
    );
  }
}
