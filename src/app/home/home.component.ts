import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthenticationService, UserService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _layoutSubscriber: Subscription;

  movies: Array<any> = [];
  colNumber: number = 3;

  loadingUserData = true;

  constructor(private authenticationService: AuthenticationService, private userService: UserService, breakpointObserver: BreakpointObserver) {
    const layoutChanges = breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]);
    this._layoutSubscriber = layoutChanges.subscribe((result) => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.Small]) {
          this.colNumber = 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.colNumber = 3;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.colNumber = 3;
        }
      } else {
        this.colNumber = 1;
      }
    });
  }

  ngOnInit(): void {
    if (this.user) this.userService.getUserData(this.user.userId).pipe(first()).subscribe(_ => this.loadingUserData = false, error => console.log(error));
    this.movies = [
      {
        id: 'qsdfqsd',
        title: 'Movie 1',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      },
      {
        id: 'gsdfgsdf',
        title: 'Movie 2',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: true,
      },
      {
        id: 'razrazer',
        title: 'Movie 3',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      },
      {
        id: 'vbncvbn',
        title: 'Movie 4',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      },
      {
        id: 'dqsfhgg',
        title: 'Movie 5',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: true,
      },
      {
        id: 'xvfqsdq',
        title: 'Movie 6',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      }
    ]
  }

  ngOnDestroy(): void {
    if (this._layoutSubscriber) this._layoutSubscriber.unsubscribe();
  }

  toggle(movieId: string): void {
    if (!this.user) return;
    if (this.userMovies.includes(movieId)) {
      this.userService.unwatchMovie(this.user.userId, movieId).pipe(first()).subscribe(_ => _, error => console.error(error));
    } else {
      this.userService.watchMovie(this.user.userId, movieId).pipe(first()).subscribe(_ => _, error => console.error(error));
    }
  }

  public get user() {
    return this.authenticationService.currentUserValue;
  }

  public get userMovies() {
    return this.userService.currentUserDataValue?.watchedMovies || [];
  }

}
