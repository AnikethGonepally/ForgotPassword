import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 🔥 FIXED PORT
  private apiUrl = 'http://localhost:5175/api/auth';

  constructor(private http: HttpClient) {}

  // ✅ REGISTER
  register(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password }).pipe(
      tap((res) => {
        if (res?.username) {
          localStorage.setItem('username', res.username);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error?.message || 'Registration failed');
      })
    );
  }

  // ✅ LOGIN
  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        if (res?.username) {
          localStorage.setItem('username', res.username);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error?.message || 'Invalid login');
      })
    );
  }

  // ✅ FORGOT PASSWORD
  forgotPassword(input: string) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { input }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error?.message || 'Failed to send OTP');
      })
    );
  }

  // ✅ VERIFY OTP
  verifyOtp(input: string, otp: string) {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, { input, otp }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error?.message || 'Invalid OTP');
      })
    );
  }

  // ✅ RESET PASSWORD
  resetPassword(input: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { input, newPassword }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error?.message || 'Reset failed');
      })
    );
  }

  // ✅ HELPERS
  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('username');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}