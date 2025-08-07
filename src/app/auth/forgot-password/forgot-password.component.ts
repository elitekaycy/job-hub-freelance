import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  `]
})
export class ForgotPasswordComponent {
  form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
  });

  constructor(private readonly fb: FormBuilder) {}

  onSubmit() {
    if (this.form.valid) {
      console.log('Reset link sent to:', this.form.value.email);
    }
  }
}
