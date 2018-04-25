import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'name': new FormControl(undefined, [
        Validators.required,
        Validators.minLength(8),
      ]),
      'email': new FormControl(undefined, [Validators.required, Validators.email]),
      'username': new FormControl(undefined, [Validators.required, Validators.minLength(6)]),
      'password': new FormControl(undefined, [Validators.required, Validators.minLength(8)])
    });
  }

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }

  getHelpMessage(fieldName: string) {
    const errors = this.registerForm.controls[fieldName].errors;
    if (!errors) {
      return null;
    } else if (errors.required) {
      return `This field is required.`;
    } else if (errors.minlength) {
      return `Must be at least ${errors.minlength.requiredLength} character.`;
    } else if (errors.email) {
      return `Not a valid email format.`;
    }
  }

  registerUser() {
    if (this.registerForm.valid) {
      const userDetails = this.registerForm.value;
      this.authService.register(userDetails).subscribe(
        data => {
          alert(data.message);
          this.router.navigateByUrl('/dashboard');
        },
        error => {
          console.error(error);
          alert(`Failed to register. Please try again later.`);
        }
      );
    } else {
      alert(`Form is invalid. Please make sure all fields are filled in and they meet the requirements.`);
    }
  }

}
