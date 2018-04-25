import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  authenticateUser() {
    this.authService.authenticate(this.username, this.password).subscribe(response => {
      // if success, auth token has already been saved/cached into global AuthService for later use
      alert(`${response.message}`);
      if (response.success) {
        // TODO: Navigate to user dashboard
      }
    });
  }

  /**
   * For debugging perposes. Submits request to check if
   * (1) we have token stored in auth service
   * (2) if token is valid
   */
  checkUserLoggedIn() {
    this.authService.isUserLoggedIn().subscribe(
      response => {
        console.log(response);
      }
    );
  }

}
