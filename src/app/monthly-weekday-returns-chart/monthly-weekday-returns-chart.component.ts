import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf, NgForOf, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { WeekdayReturnsRequest } from '../model/weekday-returns';
import { MonthlyWeekdayReturnsService } from '../services/monthly-weekday-returns.service';
import { MonthlyWeekdayChartData, MonthlyWeekdayStats } from '../model/monthly-weekday-returns';

export interface MonthlyWeekdayReturnsChartConfig {
  title: string;
  subtitle: string;
  showStats: boolean;
  height: string;
  colorScheme: 'performance' | 'heatmap';
}

@Component({
  selector: 'app-monthly-weekday-returns-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  template: `
    <div class="square-container chart-box">
      <div class="box-header">
        <div class="header-title">
          <mat-icon>calendar_view_month</mat-icon>
          <h2>{{ config?.title || 'Monthly Weekday Returns' }}</h2>
        </div>
        <p class="header-subtitle">{{ config?.subtitle || 'Analysis of returns by month and weekday' }}</p>
      </div>

      <div class="box-content">
        <!-- Loading State -->
        <div *ngIf="isLoading$ | async" class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading data...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-message">
          <mat-icon color="warn">error_outline</mat-icon>
          <p>{{ error }}</p>
        </div>

        <!-- Chart -->
        <div *ngIf="!(isLoading$ | async) && !error" class="chart-container">
          <div class="heatmap-grid">
            <div *ngFor="let data of chartData$ | async"
                 class="heatmap-cell"
                 [style.background-color]="getBackgroundColor(data.value)"
                 [style.color]="getTextColor(data.value)">
              <div class="cell-content">
                <span class="cell-value">{{ formatReturn(data.value) }}</span>
                <span class="cell-label">{{ data.displayName }}</span>
              </div>
              <div class="tooltip">
                {{ getTooltipText(data) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div *ngIf="config?.showStats && (summaryStats$ | async) as stats" class="stats-panel">
          <div class="stat-item">
            <span class="stat-label">Best Performance</span>
            <span class="stat-value positive">
              {{ stats.bestMonth }} {{ stats.bestWeekday }}: {{ formatReturn(stats.bestReturn) }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Worst Performance</span>
            <span class="stat-value negative">
              {{ stats.worstMonth }} {{ stats.worstWeekday }}: {{ formatReturn(stats.worstReturn) }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Average Return</span>
            <span class="stat-value" [class.positive]="stats.averageReturn > 0" [class.negative]="stats.averageReturn < 0">
              {{ formatReturn(stats.averageReturn) }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Volatility</span>
            <span class="stat-value">{{ (stats.volatility * 100).toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./monthly-weekday-returns-chart.component.css']
})
export class MonthlyWeekdayReturnsChartComponent implements OnInit, OnChanges {
  @Input() request!: WeekdayReturnsRequest;
  @Input() config?: MonthlyWeekdayReturnsChartConfig;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  error: string | null = null;

  constructor(private monthlyWeekdayService: MonthlyWeekdayReturnsService) {}

  private dataSubject = new BehaviorSubject<MonthlyWeekdayChartData[]>([]);
  chartData$ = this.dataSubject.asObservable();

  summaryStats$: Observable<MonthlyWeekdayStats | null> = this.chartData$.pipe(
    map(data => {
      if (data.length === 0) return null;
      
      const bestData = data.reduce((max, current) => current.value > max.value ? current : max);
      const worstData = data.reduce((min, current) => current.value < min.value ? current : min);
      const averageReturn = data.reduce((sum, current) => sum + current.value, 0) / data.length;
      const variance = data.reduce((sum, current) => sum + Math.pow(current.value - averageReturn, 2), 0) / data.length;
      const volatility = Math.sqrt(variance);

      return {
        bestMonth: bestData.month,
        bestWeekday: bestData.displayName,
        bestReturn: bestData.value,
        worstMonth: worstData.month,
        worstWeekday: worstData.displayName,
        worstReturn: worstData.value,
        averageReturn,
        volatility
      };
    })
  );

  ngOnInit(): void {
    if (this.request) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['request'] && this.request) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.loadingSubject.next(true);
    this.error = null;

    this.monthlyWeekdayService.getMonthlyWeekdayReturns(this.request)
      .pipe(
        map(data => this.monthlyWeekdayService.transformToChartData(data)),
        catchError(error => {
          this.error = error.message || 'Failed to load data';
          return [];
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(chartData => {
        this.dataSubject.next(chartData);
      });
  }

  getBackgroundColor(value: number): string {
    const config = this.config;
    if (!config || config.colorScheme === 'performance') {
      if (value > 2) return '#4CAF50';
      if (value > 1) return '#8BC34A';
      if (value > 0) return '#CDDC39';
      if (value > -1) return '#FFC107';
      if (value > -2) return '#FF9800';
      return '#F44336';
    }
    
    // Heatmap color scheme
    const abs = Math.abs(value);
    if (value > 2) return 'rgba(76, 175, 80, 0.8)';
    if (value > 1) return 'rgba(139, 195, 74, 0.6)';
    if (value > 0) return 'rgba(205, 220, 57, 0.4)';
    if (value === 0) return 'rgba(158, 158, 158, 0.2)';
    if (abs <= 1) return 'rgba(255, 193, 7, 0.4)';
    if (abs <= 2) return 'rgba(255, 152, 0, 0.6)';
    return 'rgba(244, 67, 54, 0.8)';
  }

  getTextColor(value: number): string {
    const abs = Math.abs(value);
    if (abs > 1.5) return 'white';
    return '#333';
  }

  formatReturn(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  getTooltipText(data: MonthlyWeekdayChartData): string {
    return `${data.month} ${data.displayName}: ${this.formatReturn(data.value)}`;
  }
}