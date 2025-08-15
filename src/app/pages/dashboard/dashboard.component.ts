import { Component, AfterViewInit, ViewChild, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MetricsService } from "../../../app/config/services/metricsService/metrics.service"; // adjust path
import { Chart, registerables } from 'chart.js';

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
export class DashboardComponent  {
  metrics: any = null;
  userEmail = 'you@example.com'; // replace with actual user$
  userAcronym = 'U';
  private readonly metricsSvc = inject(MetricsService);
  private readonly router = inject(Router);

  @ViewChild('trendCanvas', { static: false }) trendCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  ngOnInit() {
    // load metrics (replace with real service)
    this.metricsSvc.getMetrics().subscribe(m => {
      this.metrics = m;
      // optional: update user fields if you have user$
    });
  }

  ngAfterViewInit() {
    // draw simple line chart
    // ensure you have chart.js installed: npm i chart.js
    const ctx = (this.trendCanvas?.nativeElement).getContext('2d')!;
    this.metricsSvc.getMetrics().subscribe(m => {
      const labels = m.trend.map((t:any) => t.date);
      const data = m.trend.map((t:any) => t.applied);
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Applied',
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
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
