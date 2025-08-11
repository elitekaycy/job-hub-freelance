import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styles: [`
    .form-input {
      @apply w-full px-4 py-2 mb-3 border rounded border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300;
    }
    .btn-primary {
      @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700;
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
export class ForgotPasswordComponent {
  form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {}

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const email = this.form.value.email!;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.successMessage = `Verification code sent to ${email}`;
          this.isLoading = false;

          // Navigate to reset password with email as query param
          setTimeout(() => {
            this.router.navigate(['/reset-password'], { 
              queryParams: { email: email }
            });
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to send reset code';
          this.isLoading = false;
        }
      });
    }
  }
}
