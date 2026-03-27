export interface Movie {
  id: number;           // TMDB ID
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  addedAt?: Date;      
}