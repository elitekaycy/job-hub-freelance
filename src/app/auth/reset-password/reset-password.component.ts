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

  token = this.route.snapshot.queryParamMap.get('token') || '';
  form: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.match }
  );

  match(group: AbstractControl<any, any>) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid || !this.token) return;

    const { password } = this.form.value;
    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        alert('Password reset successfully');
        this.router.navigate(['/sign-in']);
      },
      error: (err) => alert('Reset failed: ' + err.message),
    });
  }
}
