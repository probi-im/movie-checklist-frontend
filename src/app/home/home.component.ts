import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthenticationService, UserService } from '../_services';
import { first } from 'rxjs/operators';
import { MovieService } from '../_services/movie.service';
import { FormControl } from '@angular/forms';

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

  currentPage = 0;

  searchControl = new FormControl('');

  autoLoadMovies = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private movieService: MovieService,
    breakpointObserver: BreakpointObserver
  ) {
    const layoutChanges = breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.XLarge,
    ]);
    this._layoutSubscriber = layoutChanges.subscribe((result) => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.Small]) {
          this.colNumber = 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.colNumber = 3;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.colNumber = 4;
        }
      } else {
        this.colNumber = 2;
      }
    });
  }

  ngOnInit(): void {
    this.loadMovies(true);
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

  loadMovies(force: boolean = false) {
    if (this.loadingMovies) return;
    if (!this.autoLoadMovies && !force) return;
    this.loadingMovies = true;
    this.currentPage += 1;
    this.movieService
      .getPopularMovies(this.currentPage)
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
      this.loadMovies();
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
