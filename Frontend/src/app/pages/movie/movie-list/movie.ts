import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MovieService } from '../../../core/services/movie-service/movie';
import { Movie } from '../../../core/interfaces/movie.interface';
import { PAGES_IMPORTS } from '../../pages.imports';
import { AlertService } from '../../../core/services/alert-service/alert';
import { HttpService } from '../../../core/services/http-service/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.html',
  standalone: true,
  imports: [...PAGES_IMPORTS, RouterLink],
  styleUrls: ['./movie.scss']
})
export class MovieComponent implements OnInit {
  loading = false;
  error = '';
  watchlistIds = new Set<number>();

  constructor(
    private movieService: MovieService,
    private alert: AlertService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.loadWatchlist();
  }

  // Bind local template 'query' variable to service cache
  get query(): string {
    return this.movieService.cachedQuery;
  }

  set query(value: string) {
    this.movieService.cachedQuery = value;
  }

  // Bind local template 'movies' variable to service cache
  get movies(): Movie[] {
    return this.movieService.cachedMovies;
  }

  set movies(value: Movie[]) {
    this.movieService.cachedMovies = value;
  }

  // Load current watchlist IDs from backend
  loadWatchlist() {
    this.httpService.get<Movie[]>('watchlist').subscribe({
      next: (res) => {
        this.watchlistIds = new Set(res.map(m => m.id));
        this.cdr.detectChanges();
      }
    });
  }

  search() {
    if (!this.query.trim()) return;

    this.loading = true;
    this.movies = []; // Clears the service cache via the setter
    this.error = '';

    this.movieService.searchMovies(this.query).subscribe({
      next: (res) => {
        this.movies = res; // Updates service cache via the setter
        this.loading = false;

        // Force Angular to update the view
        this.cdr.detectChanges();

        setTimeout(() => {
          if (res.length > 0) {
            this.alert.success('Search successful', `Loaded ${res.length} movies.`);
          } else {
            this.alert.show('info', 'No movies found.');
          }
        }, 100);
      },
      error: (err) => {
        this.loading = false;
        this.alert.error('Error', 'Failed to fetch movies');
      }
    });
  }

  toggleWatchlist(movie: Movie) {
    if (this.watchlistIds.has(movie.id)) {
      // remove from watchlist
      this.httpService.delete('watchlist', movie.id).subscribe({
        next: () => {
          this.watchlistIds.delete(movie.id);
          this.cdr.detectChanges();
          this.alert.success('Removed!', `${movie.title} removed from watchlist.`);
        },
        error: () => this.alert.error('Error', 'Could not remove from watchlist')
      });
    } else {
      // add to watchlist
      this.httpService.post('watchlist', movie).subscribe({
        next: () => {
          this.watchlistIds.add(movie.id);
          this.cdr.detectChanges();
          this.alert.success('Added!', `${movie.title} added to watchlist.`);
        },
        error: () => this.alert.error('Error', 'Could not save to watchlist')
      });
    }
  }

  isInWatchlist(movie: Movie) {
    return this.watchlistIds.has(movie.id);
  }
}
