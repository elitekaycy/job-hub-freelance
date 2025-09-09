import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <a routerLink="/" class="text-2xl font-bold text-blue-600">JobHub</a>
            </div>
            <div class="flex items-center space-x-4">
              <ng-container *ngIf="isAuthenticated$ | async; else guestLinks">
                <a routerLink="/dashboard" class="text-gray-600 hover:text-gray-900">Dashboard</a>
              </ng-container>
              <ng-template #guestLinks>
                <a routerLink="/auth/signin" class="text-gray-600 hover:text-gray-900">Sign In</a>
                <a routerLink="/auth/signup" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Get Started</a>
              </ng-template>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <main class="flex-grow flex items-center justify-center">
        <div class="max-w-md w-full text-center px-4">
          <div class="mb-8">
            <div class="text-9xl font-bold text-gray-300 mb-4">404</div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p class="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div class="space-y-4">
            <ng-container *ngIf="isAuthenticated$ | async; else guestButtons">
              <a routerLink="/dashboard" class="block w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200">
                Go to Dashboard
              </a>
            </ng-container>
            <ng-template #guestButtons>
              <a routerLink="/" class="block w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200">
                Go Home
              </a>
            </ng-template>
            
            <button onclick="history.back()" class="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-200">
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  `
})
export class PageNotFoundComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticatedBoolean$;
  }
}