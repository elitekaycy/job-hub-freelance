import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../config/services/apiService/api.service';
import { ToastService } from '../../../config/services/toast/toast.service';
import { from } from 'rxjs';

interface DailyStat {
  date: string;
  claimed: number;
}

interface RecentActivity {
  description: string;
  type: string;
  dateTime: string;
}

interface Summary {
  totalActivitiesFound: number;
  recentPeriod: string;
  statsPeriod: string;
}

interface QueryParameters {
  recentDays: number;
  recentLimit: number;
  statsDays: number;
  generatedAt: string;
}

interface AdminStatistics {
  summary: Summary;
  totalPostedJobs: number;
  totalExpiredJobs: number;
  queryParameters: QueryParameters;
  stats: DailyStat[];
  totalApprovedJobs: number;
  totalJobs: number;
  totalClaimedJobs: number;
  totalSubmittedJobs: number;
  totalRejectedJobs: number;
  recent: RecentActivity[];
}

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Admin Statistics</h1>
            <p class="text-gray-600 mt-1" *ngIf="statistics?.summary">
              Analytics for the last {{ statistics?.summary?.statsPeriod }}
              • Generated {{ statistics?.queryParameters ? formatDateTime(statistics?.queryParameters?.generatedAt || '') : 'N/A' }}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button 
              (click)="refreshStats()"
              [disabled]="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ loading ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex items-center justify-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="ml-3 text-gray-600">Loading statistics...</p>
      </div>

      <!-- Statistics Content -->
      <div *ngIf="!loading && statistics" class="px-6 py-6">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <!-- Total Jobs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  📊
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Jobs</p>
                <p class="text-2xl font-bold text-gray-900">{{ statistics?.totalJobs || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Posted Jobs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  ➕
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Posted Jobs</p>
                <p class="text-2xl font-bold text-green-600">{{ statistics?.totalPostedJobs || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Claimed Jobs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  🔒
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Claimed Jobs</p>
                <p class="text-2xl font-bold text-yellow-600">{{ statistics?.totalClaimedJobs || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Submitted Jobs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  📤
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Submitted Jobs</p>
                <p class="text-2xl font-bold text-blue-600">{{ statistics?.totalSubmittedJobs || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Approved Jobs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  ✅
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Approved Jobs</p>
                <p class="text-2xl font-bold text-purple-600">{{ statistics?.totalApprovedJobs || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Stats Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Job Status Breakdown -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Job Status Summary</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Total Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalJobs || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Posted Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalPostedJobs || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Claimed Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalClaimedJobs || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Submitted Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalSubmittedJobs || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Approved Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalApprovedJobs || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Rejected Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalRejectedJobs || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  <span class="text-sm text-gray-700">Expired Jobs</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ statistics?.totalExpiredJobs || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Claims Chart -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Daily Claims Trend ({{ statistics.summary?.statsPeriod }})</h3>
            <div class="relative" style="height: 200px;">
              <canvas #claimsChart></canvas>
            </div>
          </div>
        </div>

        <!-- Daily Statistics -->
        <div *ngIf="statistics?.stats && statistics.stats.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Daily Claims Statistics ({{ statistics.summary?.statsPeriod }})</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let day of getRecentStats()">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(day.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex items-center">
                      <span class="mr-2">{{ day.claimed }}</span>
                      <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                        <div class="bg-blue-500 h-2 rounded-full" [style.width.%]="getClaimPercentage(day.claimed)"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Activity -->
        <div *ngIf="statistics?.recent && statistics.recent.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity ({{ statistics.summary?.recentPeriod }})
            <span class="text-sm font-normal text-gray-500 ml-2">
              • {{ statistics.summary?.totalActivitiesFound }} activities found
            </span>
          </h3>
          <div class="space-y-4">
            <div *ngFor="let activity of statistics.recent" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                       [class]="getActivityTypeClass(activity.type)">
                    {{ getActivityTypeIcon(activity.type) }}
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                  <p class="text-sm text-gray-500">{{ activity.type }}</p>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                {{ activity.dateTime }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!loading && !statistics" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="text-6xl mb-4">📊</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load statistics</h3>
          <p class="text-gray-500 mb-4">Unable to retrieve admin statistics data.</p>
          <button 
            (click)="loadStatistics()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('claimsChart', { static: false }) claimsChart!: ElementRef<HTMLCanvasElement>;
  
  statistics: AdminStatistics | null = null;
  loading = false;
  private chart: any;

  constructor(
    private readonly apiService: ApiService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  ngAfterViewInit() {
    // Chart will be created after data is loaded
  }

  loadStatistics() {
    this.loading = true;
    this.apiService.getAdminStatistics().subscribe({
      next: (data) => {
        console.log('Admin Statistics API Response:', data);
        console.log('Available properties:', Object.keys(data));
        this.statistics = data;
        this.loading = false;
        setTimeout(() => this.createChart(), 100); // Delay to ensure DOM is ready
      },
      error: (error) => {
        console.error('Failed to load admin statistics:', error);
        this.toastService.error('Failed to load statistics. Please try again.');
        this.loading = false;
      }
    });
  }

  refreshStats() {
    this.loadStatistics();
  }

  formatDate(dateString: string): string {
    // Convert from "25-08-27" format to readable format
    const parts = dateString.split('-');
    const year = '20' + parts[0];
    const month = parts[1];
    const day = parts[2];
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  getRecentStats(): DailyStat[] {
    if (!this.statistics?.stats) return [];
    // Show last 10 days
    return this.statistics.stats.slice(-10);
  }

  getClaimPercentage(claims: number): number {
    if (!this.statistics?.stats) return 0;
    const maxClaims = Math.max(...this.statistics.stats.map(s => s.claimed));
    return maxClaims === 0 ? 0 : (claims / maxClaims) * 100;
  }

  createChart() {
    if (!this.statistics?.stats || !this.claimsChart) return;

    const ctx = this.claimsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Simple canvas chart implementation
    const canvas = this.claimsChart.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const data = this.statistics.stats.slice(-14); // Last 14 days
    const maxValue = Math.max(...data.map(d => d.claimed), 1);
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw bars
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length * 0.4;

    data.forEach((item, index) => {
      const barHeight = (item.claimed / maxValue) * chartHeight;
      const x = padding + (index * (barWidth + barSpacing)) + (barSpacing / 2);
      const y = padding + chartHeight - barHeight;

      // Draw bar
      ctx.fillStyle = item.claimed > 0 ? '#3b82f6' : '#d1d5db';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top
      if (item.claimed > 0) {
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.claimed.toString(), x + barWidth / 2, y - 5);
      }
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * (5 - i));
      const y = padding + (chartHeight / 5) * i + 4;
      ctx.fillText(value.toString(), padding - 8, y);
    }
  }

  getActivityTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      case 'submitted':
        return 'bg-blue-100 text-blue-600';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-600';
      case 'posted':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getActivityTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'submitted':
        return '📤';
      case 'claimed':
        return '🔒';
      case 'posted':
        return '➕';
      default:
        return '📋';
    }
  }
}