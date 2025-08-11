import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { 
  signUp as amplifySignUp, 
  signIn as amplifySignIn, 
  signOut as amplifySignOut,
  getCurrentUser,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword
} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'https://your-api-url.com/api/auth';

  // Add these for Amplify compatibility
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  public async init(): Promise<void> {
    await this.checkAuthState();
  }

  private async checkAuthState(): Promise<void> {
    try {
     await getCurrentUser();
      this.isAuthenticatedSubject.next(true);
      localStorage.setItem('authToken', 'amplify-authenticated');
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
      console.error('Error checking auth state:', error);
      localStorage.removeItem('authToken');
      throw error; // propagate the error up the call stack
    }
  }

  signUp(data: any): Observable<any> {
    return from(amplifySignUp({
      username: data.username,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          given_name: data.firstName,
          family_name: data.lastName,
          'custom:job_preferences': JSON.stringify(data.jobPreferences || [])
        }
      }
    }));
  }

  signIn(data: any): Observable<any> {
    return from(amplifySignIn({ 
      username: data.username, 
      password: data.password 
    })).pipe(
      tap((result) => {
        this.isAuthenticatedSubject.next(true);
        // Still set localStorage for backward compatibility
        localStorage.setItem('authToken', 'amplify-authenticated');
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return from(amplifyResetPassword({ username: email }));
  }

  // resetPassword(token: string, newPassword: string): Observable<any> {
  //   // Note: Amplify needs username + code, not token
  //   // We might need to adjust this based on your UI flow
  //   return from(amplifyConfirmResetPassword({
  //     username: token, // Assuming token is actually username
  //     confirmationCode: 'CODE_FROM_EMAIL', // This needs to come from your UI
  //     newPassword
  //   }));
  // }

  confirmResetPassword(username: string, code: string, newPassword: string): Observable<any> {
    return from(amplifyConfirmResetPassword({
      username,
      confirmationCode: code,
      newPassword
    }));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken') || this.isAuthenticatedSubject.value;
  }

  login(credentials: any) {
      return this.signIn(credentials);
  }


  logout(): void {
    from(amplifySignOut()).subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        this.isAuthenticatedSubject.next(false);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still clear local storage even if Amplify logout fails
        localStorage.removeItem('authToken');
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  // Add confirmation method for email verification
  confirmSignUp(username: string, code: string): Observable<any> {
    return from(amplifyConfirmSignUp({
      username,
      confirmationCode: code
    }));
  }
}
