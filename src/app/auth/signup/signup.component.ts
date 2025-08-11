import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styles: [`
  .form-input {
    @apply w-full px-4 py-2 mb-3 border rounded border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300;
  }
  .btn-primary {
    @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700;
  }
`]
})

export class SignupComponent {
  authService = inject(AuthService);
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    jobPreferences: [[]] // Add this new field
  });

  constructor(private readonly fb: FormBuilder, private readonly router: Router) {}

  onSubmit() {
    if (this.form.valid) {
      this.authService.signUp(this.form.value).subscribe({
        next: (result) => {
          // Your existing success logic
          console.log('Signup data:', this.form.value, result);
          
          // Perform signup logic here
          this.router.navigate(['/signin']);
        },
        error: (error) => {
          // Your existing error handling
          console.error('Sign up failed', error);
        }
      });
    }
  }
}
