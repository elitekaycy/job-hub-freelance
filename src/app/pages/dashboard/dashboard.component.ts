import { Component, AfterViewInit, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MetricsService } from "../../../app/config/services/metricsService/metrics.service"; // adjust path
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { ApiService } from '../../config/services/apiService/api.service';
import { UserData } from '../../config/interfaces/general.interface';
import { getUserAcroynm } from '../../utils/utils';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styles: [`
    .clickable { @apply cursor-pointer; }
  `]
})
export class DashboardComponent implements AfterViewInit, OnInit {
  metrics: any = null;
  overview: any = null;
  userAcronym = 'SJ';
  userData: UserData = { email: '', firstName: '', lastName: '' };
  private readonly metricsSvc = inject(MetricsService);
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  @ViewChild('trendCanvas', { static: false }) trendCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  ngOnInit() {

    //Load user 
    this.loadUser();
    // load metrics (replace with real service)
    this.metricsSvc.getMetrics().subscribe(m => {
      this.metrics = m;
    });
    // load overview data
    this.loadOverview();
  }

  loadUser() {
    let user: UserData;
    this.authService.getUserAttributes().subscribe((res) => {
      user={firstName:res.firstName, lastName:res.lastName, email:res.email};
      this.userData = user;
      this.userAcronym = getUserAcroynm((this.userData.firstName + ' ' + this.userData.lastName).trim());
    });
  }

  loadOverview() {
    this.apiService.getOverview().subscribe({
      next: (data) => {
        this.overview = data;
        this.updateChart();
      },
      error: (error) => {
        console.error('Error fetching overview data:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  ngAfterViewInit() {
    if (this.overview) {
      this.updateChart();
    }
  }

  updateChart() {
    if (!this.trendCanvas || !this.overview?.stats) return;
    
    const ctx = (this.trendCanvas?.nativeElement).getContext('2d')!;
    
    if (this.chart) {
      this.chart.destroy();
    }
    
    const labels = this.overview.stats.map((stat: any) => stat.date);
    const data = this.overview.stats.map((stat: any) => stat.claimed);
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Claimed Jobs',
          data,
          fill: true,
          backgroundColor: 'rgba(37,99,235,0.12)',
          borderColor: '#2563eb',
          tension: .35,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: true, grid: { display: false } },
          y: { display: true, beginAtZero: true, ticks: { stepSize: 2 } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
