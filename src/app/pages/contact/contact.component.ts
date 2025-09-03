import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-2xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="mb-8">
          <a routerLink="/" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </a>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p class="text-gray-600">Get in touch with our support team</p>
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div>
                <h3 class="font-semibold text-gray-900">Email</h3>
                <p class="text-gray-600">support&#64;jobhub.com</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 class="font-semibold text-gray-900">Response Time</h3>
                <p class="text-gray-600">We typically respond within 24 hours</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 class="font-semibold text-gray-900">Support</h3>
                <p class="text-gray-600">Available Monday to Friday, 9 AM - 6 PM</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="font-semibold text-gray-900 mb-2">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/privacy" class="text-blue-600 hover:text-blue-800">Privacy Policy</a></li>
              <li><a routerLink="/terms" class="text-blue-600 hover:text-blue-800">Terms of Service</a></li>
              <li><a routerLink="/auth/signin" class="text-blue-600 hover:text-blue-800">Sign In</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {}