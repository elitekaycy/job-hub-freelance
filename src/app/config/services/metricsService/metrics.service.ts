import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

export interface Metrics {
  totalJobs: number;
  appliedCount: number;
  completedCount: number;
  paidCount: number;
  expiredCount: number;
  appliedPct: number;
  completedPct: number;
  paidPct: number;
  recentActions: Array<{ title: string; status: string; date: string }>;
  trend: { date: string; applied: number }[];
}

@Injectable({ providedIn: 'root' })
export class MetricsService {
  constructor(){}

  getMetrics(): Observable<Metrics> {
    const now = new Date();
    const trend = Array.from({length: 8}).map((_,i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (7 - i));
      return { date: d.toISOString().slice(0,10), applied: Math.round(3 + Math.random()*10) };
    });

    const metrics: Metrics = {
      totalJobs: 128,
      appliedCount: 24,
      completedCount: 15,
      paidCount: 12,
      expiredCount: 6,
      appliedPct: Math.round(24 / 128 * 100),
      completedPct: Math.round(15 / 24 * 100),
      paidPct: Math.round(12 / 15 * 100),
      recentActions: [
        { title: 'Applied — Frontend Dev', status: 'Applied', date: new Date().toISOString() },
        { title: 'Job Completed — Logo Design', status: 'Completed', date: new Date(Date.now()-86400000).toISOString() },
        { title: 'Applied — Backend Dev', status: 'Expired', date: new Date(Date.now()-2*86400000).toISOString() }
      ],
      trend
    };

    return of(metrics);
  }
}

