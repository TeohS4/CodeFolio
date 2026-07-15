export interface Movie {
  id: number;           // TMDB ID
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  addedAt?: Date;   
}

export interface MovieDetails extends Movie {
  backdrop_path: string;
  tagline: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget: number;
  revenue: number;
  status: string;
  original_language: string;
  genres: {
    id: number;
    name: string;
  }[];
}