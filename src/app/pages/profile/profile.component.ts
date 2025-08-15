import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { MultiSelectComponent } from '../../components/multiselect/multiselect.component';
import { jobPreferenceOptions } from '../../config/data/jobs.data';
import { VerifiableUserAttributeKey, type UpdateUserAttributesOutput } from 'aws-amplify/auth';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MultiSelectComponent, FormsModule],
  templateUrl: './profile.component.html',
  styles: [`
    .form-input {
      @apply w-full px-4 py-2 mb-3 border rounded border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300;
    }
    .btn-primary {
      @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center flex justify-center items-center;
    }
    .btn-danger {
      @apply bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-center flex justify-center items-center;
    }
    .btn-secondary {
      @apply bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 text-center flex justify-center items-center;
    }
    .section-divider {
      @apply my-4 border-t border-gray-200;
    }
    .modal {
      @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
    }
    .modal-content {
      @apply bg-white rounded-lg p-6 w-full max-w-md;
    }
    .error-message {
      @apply text-red-600 text-sm mb-3;
    }
    .success-message {
      @apply text-green-600 text-sm mb-3;
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  jobPreferenceOptions = jobPreferenceOptions;
  errorMessage = '';
  successMessage = '';
  loading = false;
  showDeleteConfirmation = false;
  showVerification = false;
  verificationCode = '';
  verificationAttribute : VerifiableUserAttributeKey | ""= '';

  form = this.fb.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    jobPreferences: [[] as string[]],
    oldPassword: [''],
    newPassword: ['', Validators.minLength(8)],
    confirmNewPassword: ['']
  }, { validators: this.passwordChangeValidator });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.loading = true;
    this.authService.getUserAttributes().subscribe({
      next: (userData) => {
        this.form.patchValue({
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          jobPreferences: userData.jobPreferences || []
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load profile data';
        this.loading = false;
      }
    });
  }

  passwordChangeValidator(control: AbstractControl): ValidationErrors | null {
    const oldPassword = control.get('oldPassword')?.value;
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    if (!oldPassword) {
      return null;
    }

    if (!newPassword || !confirmNewPassword) {
      return { required: true };
    }

    if (newPassword !== confirmNewPassword) {
      return { mismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { firstName, middleName, lastName, phoneNumber, jobPreferences, oldPassword, newPassword } = this.form.value;

      const updates = { firstName: firstName!, middleName: middleName!, lastName: lastName!, phoneNumber: phoneNumber!, jobPreferences: jobPreferences! };

      this.authService.updateUserAttributes(updates).subscribe({
        next: (result: UpdateUserAttributesOutput) => {
          // Check for attributes requiring verification
          // Filter for verifiable attributes (email or phone_number)
          const verifiableAttributes: VerifiableUserAttributeKey[] = ['email', 'phone_number'];
          const attributesNeedingVerification = Object.entries(result['attributes'] || {}).filter(
            ([key, status]) => verifiableAttributes.includes(key as VerifiableUserAttributeKey) && status.isUpdated === false && status.codeDeliveryDetails
          );

          if (attributesNeedingVerification.length > 0) {
            const [attributeKey, status] = attributesNeedingVerification[0];
            this.verificationAttribute = attributeKey as VerifiableUserAttributeKey;
            this.successMessage = `Verification code sent to ${status.codeDeliveryDetails?.deliveryMedium || 'your contact'}. Please verify.`;
            this.showVerification = true;
            this.loading = false;
          } else {
            this.handlePasswordChange(oldPassword!, newPassword!);
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Profile update failed';
          this.loading = false;
        }
      });
    }
  }

  confirmAttribute() {
    if (this.verificationCode && this.verificationAttribute) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.confirmUserAttribute(this.verificationAttribute, this.verificationCode).subscribe({
        next: () => {
          this.successMessage = `${this.verificationAttribute} verified successfully`;
          this.showVerification = false;
          this.verificationCode = '';
          this.verificationAttribute = '';
          this.loading = false;
          // Proceed with password change if applicable
          const { oldPassword, newPassword } = this.form.value;
          this.handlePasswordChange(oldPassword!, newPassword!);
        },
        error: (err: any) => {
          this.errorMessage = err.message || 'Verification failed';
          this.loading = false;
        }
      });
    }
  }

  private handlePasswordChange(oldPassword: string, newPassword: string) {
    if (oldPassword && newPassword) {
      this.authService.changePassword(oldPassword, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Profile and password updated successfully';
          this.loading = false;
          this.form.patchValue({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        },
        error: (err) => {
          this.errorMessage = err.message || 'Password change failed';
          this.loading = false;
        }
      });
    } else {
      this.successMessage = 'Profile updated successfully';
      this.loading = false;
    }
  }

  openDeleteConfirmation() {
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.deleteUser().pipe(
      switchMap(() => this.authService.logout())
    ).subscribe({
      next: () => {
        this.successMessage = 'Account deleted successfully. Redirecting to sign-in...';
        this.loading = false;
        this.showDeleteConfirmation = false;
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete account';
        this.loading = false;
        this.showDeleteConfirmation = false;
      }
    });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.errorMessage = '';
  }

  signOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/signin']);
      },
      error: (err) => {
        console.error('Sign-out error:', err);
        this.router.navigate(['/auth/signin']);
      }
    });
  }
}