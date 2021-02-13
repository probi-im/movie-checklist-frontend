import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthenticationService, UserService } from '../_services';
import { first } from 'rxjs/operators';
import { MovieService } from '../_services/movie.service';
import { FormControl } from '@angular/forms';

const MAX_PAGE_COUNT = 5;

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
  firstLoadingMovies = true;
  loadingMovies = false;

  currentPage = 1;

  searchControl = new FormControl('');

  autoLoadMovies = true;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private movieService: MovieService,
    breakpointObserver: BreakpointObserver
  ) {
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
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.colNumber = 3;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.colNumber = 4;
        }
      } else {
        this.colNumber = 1;
      }
    });
  }

  ngOnInit(): void {
    this.loadMovies(this.currentPage);
    if (this.user)
      this.userService
        .getUserData(this.user.userId)
        .pipe(first())
        .subscribe(
          (_) => (this.loadingUserData = false),
          (error) => console.log(error)
        );
  }

  ngOnDestroy(): void {
    if (this._layoutSubscriber) this._layoutSubscriber.unsubscribe();
  }

  loadMovies(page: number) {
    if (this.loadingMovies) return;
    this.loadingMovies = true;
    this.movieService
      .getPopularMovies(page)
      .pipe(first())
      .subscribe(
        (res) => {
          this.movies = [...this.movies, ...res];
          this.firstLoadingMovies = false;
          this.loadingMovies = false;
        },
        (error) => console.log(error)
      );
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    const max = (document.documentElement.scrollHeight * 90) / 100;
    if (pos >= max) {
      if (
        !this.autoLoadMovies ||
        this.loadingMovies ||
        this.currentPage === MAX_PAGE_COUNT
      )
        return;
      this.currentPage += 1;
      this.loadMovies(this.currentPage);
    }
  }

  toggle(movieId: string): void {
    if (!this.user) return;
    if (this.userMovies.includes(movieId)) {
      this.userService
        .unwatchMovie(this.user.userId, movieId)
        .pipe(first())
        .subscribe(
          (_) => _,
          (error) => console.error(error)
        );
    } else {
      this.userService
        .watchMovie(this.user.userId, movieId)
        .pipe(first())
        .subscribe(
          (_) => _,
          (error) => console.error(error)
        );
    }
  }

  public get filteredMovies() {
    return this.movies.filter((m) =>
      m.title
        .toLowerCase()
        .includes(this.searchControl.value.trim().toLowerCase())
    );
  }

  public get user() {
    return this.authenticationService.currentUserValue;
  }

  public get userMovies() {
    return this.userService.currentUserDataValue?.watchedMovies || [];
  }
}
