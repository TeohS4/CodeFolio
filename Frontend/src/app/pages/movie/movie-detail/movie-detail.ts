import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../core/services/movie-service/movie';
import { MovieDetails } from '../../../core/interfaces/movie.interface';
import { PAGES_IMPORTS } from '../../pages.imports';
import { Location } from '@angular/common';
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.scss']
})
export class MovieDetail {

  movie!: MovieDetails;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location 
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovieDetail(id).subscribe({
      next: (res) => {
        this.movie = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}