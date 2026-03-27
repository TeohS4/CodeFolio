import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from '../../../core/services/http-service/http';
import { AlertService } from '../../../core/services/alert-service/alert';
import { Movie } from '../../../core/interfaces/movie.interface';
import { PAGES_IMPORTS } from '../../pages.imports';


@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './watch-list.html',
  styleUrls: ['./watch-list.scss']
})
export class WatchListComponent implements OnInit {
  watchList: Movie[] = [];

  constructor(
    private http: HttpService,
    private alert: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWatchList();
  }

  loadWatchList(): void {
    this.http.get<Movie[]>('watchlist').subscribe({
      next: (data) => {
        this.watchList = data;
        this.cdr.detectChanges();
      },
      error: () => this.alert.error('Error', 'Failed to fetch watchlist')
    });
  }

  removeItem(id: number): void {
  this.http.delete('watchlist', id).subscribe({
    next: () => {
      this.watchList = this.watchList.filter(m => Number(m.id) !== Number(id));
      
      // Re-trigger detection
      this.cdr.markForCheck(); 
      this.cdr.detectChanges();
      
      this.alert.success('Removed', 'Movie removed from your list');
    },
    error: () => this.alert.error('Delete Failed', 'Check backend connection')
  });
}
}