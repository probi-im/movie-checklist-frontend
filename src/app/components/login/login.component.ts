import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', Validators.required);

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // get return url from route parameters or default to '/'
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.emailControl.invalid || this.passwordControl.invalid) return;
    this.authenticationService.login(this.emailControl.value, this.passwordControl.value).pipe(first()).subscribe(data => {
      this.router.navigate([returnUrl])
    }, error => console.error(error));
  }

}
