import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) { }

  getPopularMovies(page: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/movies/popular/${page}`);
  }

  searchMovies(search: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/movies/search/${search}`);
  }
}
