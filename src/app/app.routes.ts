import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './config/guard/auth.guard';
import { guestGuard } from './config/guard/guest.guard';
import { adminGuard } from './config/guard/admin.guard';
import { AuthLayoutComponent } from './pages/layout/auth-layout/auth-layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardLayoutComponent } from './pages/layout/dashboard-layout/dashboard-layout.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminStatisticsComponent } from './pages/admin/admin-statistics/admin-statistics.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  // Public routes (no authentication required)
  { path: '', component: LandingComponent },
  { 
    path: 'privacy', 
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  { 
    path: 'terms', 
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },

  // Auth routes (only for unauthenticated users)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: 'signup', component: SignupComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', redirectTo: 'signin' },
    ],
  },

  // Protected routes (only for authenticated users) - with layout
  { path: 'dashboard', component: DashboardLayoutComponent, canActivate: [authGuard], children: [
    { path: '', component: DashboardComponent }
  ]},
  { path: 'jobs', component: DashboardLayoutComponent, canActivate: [authGuard], children: [
    { path: '', loadComponent: () => import('./pages/jobs/job-seekers-board/job-seekers-board.component').then(m => m.JobSeekersBoardComponent) }
  ]},
  { path: 'manage-jobs', component: DashboardLayoutComponent, canActivate: [authGuard], children: [
    { path: '', loadComponent: () => import('./pages/jobs/job-owners-board/job-owners-board.component').then(m => m.JobOwnersBoardComponent) }
  ]},
  { path: 'profile', component: DashboardLayoutComponent, canActivate: [authGuard], children: [
    { path: '', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) }
  ]},
  { path: 'admin', component: DashboardLayoutComponent, canActivate: [adminGuard], children: [
    { path: '', component: AdminComponent }
  ]},
  { path: 'admin/statistics', component: DashboardLayoutComponent, canActivate: [adminGuard], children: [
    { path: '', component: AdminStatisticsComponent }
  ]},

  // Fallback route
  { path: '**', component: PageNotFoundComponent }
];
