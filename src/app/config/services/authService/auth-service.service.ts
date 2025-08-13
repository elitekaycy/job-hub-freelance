import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { 
  signUp as amplifySignUp, 
  signIn as amplifySignIn, 
  signOut as amplifySignOut,
  getCurrentUser,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  deleteUser as amplifyDeleteUser
} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    await this.checkAuthState();
  }

  private async checkAuthState(): Promise<void> {
    try {
     await getCurrentUser();
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
      console.error('Error checking auth state:', error);
    }
  }

  signUp(data: {email: string; password: string; firstName?: string; middleName?: string; lastName?: string;phoneNumber?: string; jobPreferences?: string[] }): Observable<any> {
    
    const signUpPayload={
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          ...(data.firstName && { given_name: data.firstName }),
          ...(data.phoneNumber && { phone_number: data.phoneNumber }),
          ...(data.lastName && { family_name: data.lastName }),
          ...(data.middleName && { middle_name: data.middleName }),   
          ...(data.jobPreferences && { 'custom:job_category_ids': JSON.stringify(data.jobPreferences || []) })         
        }
      }
    }
  
    return from(amplifySignUp(signUpPayload)).pipe(
      tap((response) => console.log('Sign-up response:', response)),
      catchError(error => {
        console.error('Sign-up error:', error);
        throw error;
      })
    );
  }  
  
  // Add confirmation method for email verification
  confirmSignUp(email: string, code: string): Observable<any> {
    return from(amplifyConfirmSignUp({ username: email, confirmationCode: code })).pipe(
      catchError(error => {
        console.error('Confirmation error:', error);
        throw error;
      })
    );
  }

  signIn(data: { email: string; password: string }): Observable<any> {
    return from(amplifySignIn({ 
      username: data.email, 
      password: data.password 
    })).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Sign-in error:', error);
        throw error;
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return from(amplifyResetPassword({ username: email })).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        throw error;
      })
    );
  }

  confirmResetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return from(amplifyConfirmResetPassword({ username: email, confirmationCode: code, newPassword })).pipe(
      catchError(error => {
        console.error('Confirm reset password error:', error);
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return from (amplifySignOut()).pipe(
    tap(() => {
        this.isAuthenticatedSubject.next(false);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.isAuthenticatedSubject.next(false);
        return of(null);
      })
    );  
  }


  isLoggedIn(): Observable<boolean> {
    return from(getCurrentUser()).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  deleteUser(): Observable<any> {
    return from(amplifyDeleteUser()).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        console.log('User deleted successfully');
      }),
      catchError(error => {
        console.error('Delete user error:', error);
        throw error;
      })
    );
  }
}
