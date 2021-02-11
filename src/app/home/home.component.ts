import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _layoutSubscriber: Subscription;

  movies: Array<any> = [];
  colNumber: number = 3;

  constructor(breakpointObserver: BreakpointObserver) {
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
    this.movies = [
      {
        title: 'Movie 1',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      },
      {
        title: 'Movie 2',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: true,
      },
      {
        title: 'Movie 3',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      },
      {
        title: 'Movie 4',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      },
      {
        title: 'Movie 5',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: true,
      },
      {
        title: 'Movie 6',
        coverUrl: 'https://images.unsplash.com/photo-1612971974363-75f8b0986b45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        watched: false,
      }
    ]
  }

  ngOnDestroy(): void {
    if (this._layoutSubscriber) this._layoutSubscriber.unsubscribe();
  }

  toggle(movieIndex: number): void {
    this.movies[movieIndex].watched = !this.movies[movieIndex].watched;
  }
}
