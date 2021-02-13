import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, Subscription } from 'rxjs';
import { AuthenticationService, UserService } from '../_services';
import { first, map, takeUntil } from 'rxjs/operators';
import { MovieService } from '../_services/movie.service';
import { FormControl } from '@angular/forms';

const MAX_PAGE_COUNT = 3;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: Array<any> = [];
  filteredMovies = this.movies;
  colNumber: number = 3;

  loadingUserData = true;
  firstLoadingMovies = true;
  loadingMovies = false;

  currentPage = 1;

  searchControl = new FormControl('');

  autoLoadMovies = true;

  refreshingMovieList = true;

  destroy$: Subject<boolean> = new Subject<boolean>();

  inputTimeout: any;

  currentMovieListType: 'popular' | 'search' = 'popular';

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
    layoutChanges.pipe(takeUntil(this.destroy$)).subscribe((result) => {
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
    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).pipe(map((rawSearch: string) => rawSearch.trim().toLowerCase())).subscribe((search: any) => {
      clearTimeout(this.inputTimeout);
      this.inputTimeout = setTimeout(() => {
        if (search === "") {
          console.log('loading popular movies')
          this.currentPage = 1;
          this.loadPopularMovies();
        } else {
          console.log('search movies with search:', search);
          this.searchMovies(search);
        }
      }, 500);
    });
  }

  ngOnInit(): void {
    this.loadPopularMovies();
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
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  loadPopularMovies(page: number = 1) {
    if (this.loadingMovies) return;
    if (page === 1) {
      this.refreshingMovieList = true;
      this.movies = [];
    }
    this.loadingMovies = true;
    this.movieService
      .getPopularMovies(page)
      .pipe(first())
      .subscribe(
        (res) => {
          this.movies = [...this.movies, ...res];
          this.filteredMovies = this.movies;
          this.currentMovieListType = 'popular';
          this.firstLoadingMovies = false;
          this.loadingMovies = false;
          this.refreshingMovieList = false;
        },
        (error) => console.log(error)
      );
  }

  searchMovies(search: string) {
    if (search === "") return;
    if (this.loadingMovies) return;
    this.loadingMovies = true;
    this.refreshingMovieList = true;
    this.movieService
      .searchMovies(search)
      .pipe(first())
      .subscribe(
        (res) => {
          this.movies = res;
          this.filteredMovies = this.movies;
          this.currentMovieListType = 'search';
          this.firstLoadingMovies = false;
          this.loadingMovies = false;
          this.refreshingMovieList = false;
        },
        (error) => console.log(error)
      );
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
          this.filteredMovies = this.movies;
          this.firstLoadingMovies = false;
          this.loadingMovies = false;
        },
        (error) => console.log(error)
      );
  }

  // searchMovies();

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
      if (this.currentMovieListType === 'popular') {
        this.currentPage += 1;
        this.loadPopularMovies(this.currentPage);
      }
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

  onSubmit() {
    // this.searchControl.
    // console.log(this.searchControl.value);
    // const value = (this.searchControl.value || '').trim().toLowerCase();
    // this.filteredMovies = this.movies.filter((m) =>
    //   m.title.toLowerCase().includes(value)
    // );
    // this.searchControl.reset();
  }

  // public get filteredMovies() {
  //   return this.movies;
  //   // return this.movies.filter((m) =>
  //   //   m.title
  //   //     .toLowerCase()
  //   //     .includes(this.searchControl.value.trim().toLowerCase())
  //   // );
  // }

  public get user() {
    return this.authenticationService.currentUserValue;
  }

  public get userMovies() {
    return this.userService.currentUserDataValue?.watchedMovies || [];
  }
}
