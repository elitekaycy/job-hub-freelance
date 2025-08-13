import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackdropComponent } from '../../pages/layout/backdrop/backdrop.component';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../config/services/authService/auth-service.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackdropComponent],
  templateUrl: './reset-password.component.html',
  styles: [`
    .form-input {
      @apply w-full border border-gray-300 rounded px-4 py-2 mb-3;
    }
    .btn-primary {
      @apply w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600;
    }
    .btn-secondary {
      @apply text-gray-600 hover:text-gray-800;
    }
    .error-message {
      @apply text-red-600 text-sm mt-1;
    }
    .success-message {
      @apply text-green-600 text-sm mt-1;
    }
  `]
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Get email from query params (passed from forgot-password component)
  email = this.route.snapshot.queryParamMap.get('email') || '';


  form: FormGroup = this.fb.group(
    {
      verificationCode: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.match }
  )

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  match(group: AbstractControl<any, any>) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid || !this.email) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { verificationCode, password } = this.form.value;
    // Use the new confirmResetPassword method
    this.authService.confirmResetPassword(this.email,verificationCode, password).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully. Redirecting to sign-in...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/auth/signin']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Reset failed. Please check your code or try again.';
        this.isLoading = false;
      }
    });
  }

  // Go back to forgot password
  goBack() {
    this.router.navigate(['/auth/forgot-password']);
  }

  // Resend verification code
  resendCode() {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe({
        next: () => {
          this.successMessage = 'New verification code sent!';
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to resend code';
        }
      });
    }
  }
}
