import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { tap } from 'rxjs/operators';

export interface AuthResponse {
  message: string;
  success: boolean;
  error?: any;
  token?: string;
}

@Injectable()
export class AuthService {

  private token: string;

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string) {
    return this.http.post<AuthResponse>('/api/authenticate', {
      username,
      password,
    }).pipe(
      tap(response => {
        if (response.success) {
          this.token = response.token;
        }
      })
    );
  }

  getAuthHeader() {
    if (this.token) {
      return {
        headers: {
          'x-access-token': this.token,
        }
      };
    }
    return undefined;
  }

  isUserLoggedIn() {
    return this.http.post<AuthResponse>('/api/isLoggedIn', {
      token: this.token,
    }, this.getAuthHeader());
  }

}
