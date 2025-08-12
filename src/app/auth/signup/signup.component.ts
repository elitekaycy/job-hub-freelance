import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors,FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { MultiSelectComponent } from '../../components/multiselect/multiselect.component';
import { jobPreferenceOptions } from '../../config/data/jobs.data';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,MultiSelectComponent,FormsModule],
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
  jobPreferenceOptions = jobPreferenceOptions;
  showConfirmation = signal(false);
  confirmationCode = signal('');
  errorMessage = '';

  form = this.fb.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    jobPreferences: [''] // Add this new field
  },{ validators: this.passwordMatchValidator });

  constructor(private readonly fb: FormBuilder, private readonly router: Router) {}


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

    // Handle selection changes (optional)
  onJobPreferencesChange(selectedIds: string[]): void {
    console.log('Selected job preferences:', selectedIds);
    this.form.patchValue({ jobPreferences: selectedIds.join(',') });
  }

  onSubmit() {
    if (this.form.valid) {
      const { firstName, middleName, lastName, email,phoneNumber, password, jobPreferences } = this.form.value;
      this.authService.signUp({ email:email!, password:password!, firstName:firstName!, middleName:middleName! ,lastName:lastName!,phoneNumber:phoneNumber!, jobPreferences:jobPreferences! }).subscribe({
          next: () => {
            this.showConfirmation.set(true) ; // Show confirmation form
          },
          error: (err) => {
            this.errorMessage = err.message || 'Sign-up failed';
          }
      });
    }
  }

  onConfirm() {
    const email = this.form.get('email')?.value;
    if (email && this.confirmationCode()) {
      this.authService.confirmSignUp(email, this.confirmationCode()).subscribe({
        next: () => {
          this.router.navigate(['/signin']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Confirmation failed';
        }
      });
    }
  }

}
