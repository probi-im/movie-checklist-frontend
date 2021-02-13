import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { UserData } from '../_models';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserDataSubject: BehaviorSubject<UserData | null>;
  public currentUserData: Observable<UserData | null>;

  constructor(private http: HttpClient) {
    this.currentUserDataSubject = new BehaviorSubject<UserData | null>(null);
    this.currentUserData = this.currentUserDataSubject.asObservable();
  }

  public get currentUserDataValue(): UserData | null {
    return this.currentUserDataSubject.value;
  }

  getUserData(userId: string) {
    return this.http
      .get<UserData>(`${environment.apiUrl}/users/${userId}`)
      .pipe(
        map((response) => {
          this.currentUserDataSubject.next(response);
          return response;
        })
      );
  }

  watchMovie(userId: string, movieId: string) {
    return this.http
      .post<UserData>(`${environment.apiUrl}/users/${userId}/watch`, {
        movieId,
      })
      .pipe(
        map((response) => {
          this.currentUserDataSubject.next(response);
          return response;
        })
      );
  }

  unwatchMovie(userId: string, movieId: string) {
    return this.http
      .post<UserData>(`${environment.apiUrl}/users/${userId}/unwatch`, {
        movieId,
      })
      .pipe(
        map((response) => {
          this.currentUserDataSubject.next(response);
          return response;
        })
      );
  }

  clearData() {
    this.currentUserDataSubject.next(null);
  }
}
