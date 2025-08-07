import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'https://your-api-url.com/api/auth';

  constructor(private readonly http: HttpClient) {}

  signUp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  signIn(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/signin`, credentials)
    .pipe(tap((res: any) => {
      localStorage.setItem('authToken', res.token);
    }));
  }


  logout(): void {
    // You may clear tokens/localStorage etc.
    localStorage.removeItem('authToken');
  }
}
