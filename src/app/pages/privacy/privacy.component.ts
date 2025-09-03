import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
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
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p class="text-gray-600">Last updated: {{ getCurrentDate() }}</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none">
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, post a job, or contact us for support.</p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>

          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties without your consent, except as described in this privacy policy.</p>

          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h2>Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <a routerLink="/contact" class="text-blue-600 hover:text-blue-800">contact us</a>.</p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {
  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }
}