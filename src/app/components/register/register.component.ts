import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
