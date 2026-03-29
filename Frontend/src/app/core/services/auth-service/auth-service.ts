import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'https://localhost:7026/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}