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

  match(group: AbstractControl<any, any>) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid ||  !this.email) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { verificationCode, password } = this.form.value;
    // Use the new confirmResetPassword method
    this.authService.confirmResetPassword(this.email,verificationCode, password).subscribe({
      next: () => {
        alert('Password reset successfully');
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Reset failed';
        this.isLoading = false;
      }
    });
  }

  // Go back to forgot password
  goBack() {
    this.router.navigate(['/forgot-password']);
  }

  // Resend verification code
  resendCode() {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe({
        next: () => {
          alert('New verification code sent!');
        },
        error: (err) => {
          this.errorMessage = 'Failed to resend code';
        }
      });
    }
  }
}
