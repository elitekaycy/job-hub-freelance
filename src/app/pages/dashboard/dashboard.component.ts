import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(public authService: AuthService, protected readonly router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  } 
    
}
