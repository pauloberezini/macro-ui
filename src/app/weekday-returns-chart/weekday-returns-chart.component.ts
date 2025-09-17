import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, BehaviorSubject, catchError, of, map } from 'rxjs';
import { 
  WeekdayReturnsService 
} from '../services/weekday-returns.service';
import {
  WeekdayChartData,
  WeekdayReturnsRequest,
  WeekdayReturns
} from '../model/weekday-returns';

export interface WeekdayReturnsChartConfig {
  title: string;
  subtitle?: string;
  showStats?: boolean;
  height?: string;
  colorScheme?: 'default' | 'performance';
}

@Component({
  selector: 'app-weekday-returns-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="square-container chart-box" [class.loading]="isLoading$ | async">
      <div class="box-header">
        <div class="header-title">
          <mat-icon class="chart-icon">trending_up</mat-icon>
          <h2>{{ config.title }}</h2>
        </div>
        <p class="header-subtitle" *ngIf="config.subtitle">{{ config.subtitle }}</p>
      </div>

      <div class="box-content">
        <!-- Loading State -->
        <div *ngIf="isLoading$ | async" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading weekday returns...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error$ | async as error" class="error-container">
          <mat-icon color="warn">error_outline</mat-icon>
          <p>{{ error }}</p>
          <button mat-button color="primary" (click)="retry()">
            <mat-icon>refresh</mat-icon>
            Retry
          </button>
        </div>

        <!-- Chart Content -->
        <div *ngIf="!(isLoading$ | async) && !(error$ | async)" class="chart-container">
          <!-- Bar Chart -->
          <div class="chart-wrapper" [style.height]="config.height || '300px'">
            <div class="chart-bars">
              <div 
                *ngFor="let dataPoint of chartData$ | async; trackBy: trackByDay"
                class="bar-container"
                [matTooltip]="getTooltipText(dataPoint)"
                matTooltipPosition="above"
              >
                <div class="bar-wrapper">
                  <div 
                    class="bar" 
                    [class.positive]="dataPoint.value > 0"
                    [class.negative]="dataPoint.value < 0"
                    [style.height.%]="getBarHeight(dataPoint.value)"
                    [style.backgroundColor]="getBarColor(dataPoint.value)"
                  ></div>
                </div>
                <div class="bar-label">{{ dataPoint.displayName }}</div>
                <div class="bar-value" [class.positive]="dataPoint.value > 0" [class.negative]="dataPoint.value < 0">
                  {{ formatReturn(dataPoint.value) }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Panel -->
          <div *ngIf="config.showStats && (summaryStats$ | async) as stats" class="stats-panel">
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Best Day</span>
                <span class="stat-value positive">{{ stats.bestDay.day }}: {{ formatReturn(stats.bestDay.return) }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Worst Day</span>
                <span class="stat-value negative">{{ stats.worstDay.day }}: {{ formatReturn(stats.worstDay.return) }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Average</span>
                <span class="stat-value">{{ formatReturn(stats.averageReturn) }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Volatility</span>
                <span class="stat-value">{{ formatReturn(stats.volatility) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./weekday-returns-chart.component.css']
})
export class WeekdayReturnsChartComponent implements OnInit, OnChanges {
  @Input() request!: WeekdayReturnsRequest;
  @Input() config: WeekdayReturnsChartConfig = {
    title: 'Weekday Returns',
    showStats: true,
    height: '300px',
    colorScheme: 'default'
  };

  private readonly weekdayService = inject(WeekdayReturnsService);

  // Observable state
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly dataSubject = new BehaviorSubject<WeekdayReturns | null>(null);

  readonly isLoading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  
  readonly chartData$: Observable<WeekdayChartData[]> = this.dataSubject.pipe(
    map(data => {
      const chartData = data ? this.weekdayService.transformToChartData(data) : [];
      this.updateMaxValue(chartData);
      return chartData;
    })
  );

  readonly summaryStats$ = this.dataSubject.pipe(
    map(data => data ? this.weekdayService.calculateSummaryStats(data) : null)
  );

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['request'] && !changes['request'].firstChange) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.request) {
      return;
    }

    // Validate request
    const validation = this.weekdayService.validateYearRange(
      this.request.fromYear, 
      this.request.toYear
    );
    
    if (!validation.valid) {
      this.errorSubject.next(validation.error || 'Invalid year range');
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.weekdayService.getWeekdayReturns(this.request).pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load data');
        return of(null);
      })
    ).subscribe(data => {
      this.loadingSubject.next(false);
      this.dataSubject.next(data);
    });
  }

  retry(): void {
    this.loadData();
  }

  trackByDay(_index: number, item: WeekdayChartData): string {
    return item.day;
  }

  getTooltipText(dataPoint: WeekdayChartData): string {
    return `${dataPoint.displayName}: ${this.formatReturn(dataPoint.value)}%`;
  }

  private maxValue = 0;

  private updateMaxValue(data: WeekdayChartData[]): void {
    this.maxValue = data.length > 0 
      ? Math.max(...data.map(d => Math.abs(d.value)))
      : 0;
  }

  getBarHeight(value: number): number {
    if (this.maxValue === 0) return 0;
    return (Math.abs(value) / this.maxValue) * 100;
  }

  getBarColor(value: number): string {
    if (this.config.colorScheme === 'performance') {
      return value > 0 ? '#4CAF50' : value < 0 ? '#F44336' : '#9E9E9E';
    }
    
    // Default color scheme
    if (value > 0) return 'var(--accent-teal)';
    if (value < 0) return 'var(--error-color)';
    return 'var(--border-medium)';
  }

  formatReturn(value: number): string {
    return value.toFixed(2);
  }
}
