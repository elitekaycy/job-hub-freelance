import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './config/guard/auth.guard';
import { guestGuard } from './config/guard/guest.guard';
import { DeleteAccountComponent } from './auth/delete-account/delete-account.component';
import { AuthLayoutComponent } from './pages/layout/auth-layout/auth-layout.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {path: '', component: LandingComponent},
  { path: 'auth', component: AuthLayoutComponent,
    children: [
      { path: '', component: LandingComponent }, 
      { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
      { path: 'signin', component: SigninComponent, canActivate: [guestGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent,  canActivate: [guestGuard] },
      { path: 'reset-password', component: ResetPasswordComponent,  canActivate: [guestGuard] },
      { path: 'delete-account', component: DeleteAccountComponent, canActivate: [authGuard] },
    ]
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'auth/signin' },
];
