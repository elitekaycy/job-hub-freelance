import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styles: [`
    .profile-acronym {
      @apply w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold;
    }
    .btn-primary {
      @apply bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200;
    }
    .btn-danger {
      @apply bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200;
    }
    .error-message {
      @apply text-red-600 text-sm mb-3;
    }
    .success-message {
      @apply text-green-600 text-sm mb-3;
    }
    .card {
      @apply bg-white p-6 rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-1;
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  user$: Observable<{ email: string; acronym: string } | null>;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor() {
    this.user$ = this.getUserDetails();
  }

  ngOnInit() {}

  private getUserDetails(): Observable<{ email: string; acronym: string } | null> {
    return from(getCurrentUser()).pipe(
      switchMap(user => 
        from(fetchUserAttributes()).pipe(
          map(attributes => {
            const email = attributes.email || user.username;
            const firstName = attributes.given_name || '';
            const lastName = attributes.family_name || '';
            const acronym = this.generateAcronym(firstName, lastName);
            return { email, acronym };
          })
        )
      ),
      catchError(() => {
        this.errorMessage = 'Failed to load user details';
        return of(null);
      })
    );
  }

  private generateAcronym(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : 'U';
  }

  signOut() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.logout().subscribe({
      next: () => {
        this.successMessage = 'Signed out successfully. Redirecting...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to sign out';
        this.isLoading = false;
      }
    });
  }

  deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.deleteUser().subscribe({
      next: () => {
        this.successMessage = 'Account deleted successfully. Redirecting...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete account';
        this.isLoading = false;
      }
    });
  }
}
