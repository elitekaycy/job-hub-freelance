import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="mb-8">
          <a routerLink="/" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </a>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p class="text-gray-600">Last updated: {{ getCurrentDate() }}</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using JobHub, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2>Use License</h2>
          <p>Permission is granted to temporarily use JobHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

          <h2>User Accounts</h2>
          <p>You are responsible for safeguarding your account password and for all activities that occur under your account.</p>

          <h2>Job Postings</h2>
          <p>Job owners are solely responsible for the content of their job postings and must ensure they comply with applicable laws.</p>

          <h2>Prohibited Uses</h2>
          <p>You may not use our service for any illegal or unauthorized purpose or to violate any laws in your jurisdiction.</p>

          <h2>Service Availability</h2>
          <p>We strive to keep the service available 24/7, but we do not guarantee uninterrupted access or that the service will be error-free.</p>

          <h2>Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please <a routerLink="/contact" class="text-blue-600 hover:text-blue-800">contact us</a>.</p>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {
  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }
}