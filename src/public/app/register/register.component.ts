import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: any;

  constructor(private authService: AuthService) { }

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
      alert(`Submitting form`);
    } else {
      // alert(`Form is invalid`);
    }
    console.log(this.registerForm);
  }

}
