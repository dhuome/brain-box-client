import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';
import { Auth, Endpoints, Routes } from 'src/app/app.constants';
import { CreateUserRequest, LoginRequest, LoginResponse } from 'src/app/types/auth';

interface DecodedToken {
  sub: string;
  phoneNumber: string;
  email: string;
  username: string;
  roleAr: string;
  roleEn: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = signal<DecodedToken | null>(null);

  constructor(private http: HttpClient, private route: Router) { }

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(Endpoints.LOGIN, loginRequest).pipe(
      tap(({ accessToken }) => {
        this.saveToken(accessToken);
        this.auth.set(this.decodeToken(accessToken));
      })
    );
  }

  createUser(createUserRequest: CreateUserRequest) {
    return this.http.post(Endpoints.USER, createUserRequest);
  }

  getAuthInfo() {
    return this.auth();
  }

  autoLogin() {
    const token = localStorage.getItem(Auth.COOKIE_ACCESS_TOKEN);
    if (token) {
      this.auth.set(this.decodeToken(token));
    }
  }

  decodeToken(accessToken: string): DecodedToken {
    return jwtDecode<DecodedToken>(accessToken);
  }

  saveToken(accessToken: string) {
    localStorage.setItem(Auth.COOKIE_ACCESS_TOKEN, accessToken);
  }

  clearAuth() {
    this.auth.set(null);
    this.route.navigate([Routes.PREFIX]);
    localStorage.removeItem(Auth.COOKIE_ACCESS_TOKEN);
  }

  hasAuthority(authority: string) {
    return !!this.getAuthInfo()?.roleEn.includes(authority);
  }
}
