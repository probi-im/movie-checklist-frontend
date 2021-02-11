import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', Validators.required);

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.emailControl.invalid || this.passwordControl.invalid) return;
    console.log('test')
  }

}
