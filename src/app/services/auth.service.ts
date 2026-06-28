import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


export interface AuthResponse {
  token: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'jwt_token';
  private readonly API_URL = '/passport/api';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(tap(res => {
        if (res.token) this.saveToken(res.token);
      }));
  }

  recovery(email: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/request-reset-password`, { email });
  }

  resetPassword(token: string, recoveryPassword: string, newPassword: string): Observable<any> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/reset`, { token, recoveryPassword, newPassword });
  }


  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.id) {
      return false;;
    }
    return true;
  }

  getAuthUserId(): number {
    const token = this.getToken();
    if (!token) throw new Error("Invalid token!");
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.id) {
      throw new Error("Invalid token!");
    }
    return payload.id;
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.debug('JWT Roles:', payload.groups);
    return payload.groups || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles()
      .includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.API_URL}/auth/me`);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
} 