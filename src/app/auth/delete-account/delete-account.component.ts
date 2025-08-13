import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-account.component.html',
  styles: [`
    .btn-danger {
      @apply bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700;
    }
    .btn-secondary {
      @apply bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600;
    }
    .error-message {
      @apply text-red-600 text-sm mb-3;
    }
    .success-message {
      @apply text-green-600 text-sm mb-3;
    }
  `]
})
export class DeleteAccountComponent {
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  confirmDelete() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.deleteUser().subscribe({
      next: () => {
        this.successMessage = 'Account deleted successfully. Redirecting to sign-in...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete account';
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']); // Adjust to your app’s home route
  }
}
