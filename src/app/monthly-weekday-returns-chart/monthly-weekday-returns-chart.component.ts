import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
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
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>calendar_view_month</mat-icon>
          {{ config?.title || 'Monthly Weekday Returns' }}
        </mat-card-title>
        <mat-card-subtitle>{{ config?.subtitle || 'Analysis of returns by month and weekday' }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
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
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .chart-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      z-index: 1;
    }

    .error-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #f44336;
      padding: 16px;
    }

    .chart-container {
      flex: 1;
      padding: 8px;
      overflow: hidden;
      min-height: 400px;
      display: flex;
      flex-direction: column;
    }

    .heatmap-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(120px, 1fr));
      gap: 12px;
      padding: 12px;
      overflow: auto;
      height: 100%;
      align-content: start;
    }

    @media (max-width: 992px) {
      .heatmap-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
    }

    @media (max-width: 768px) {
      .heatmap-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .heatmap-grid {
        grid-template-columns: 1fr;
      }
    }

    .heatmap-cell {
      position: relative;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      background: white;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .heatmap-cell:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
      z-index: 1;
    }

    .heatmap-cell:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }

    .cell-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
      width: 100%;
    }

    .cell-value {
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
      margin: 0;
    }

    .cell-label {
      font-size: 13px;
      font-weight: 500;
      opacity: 0.85;
      text-transform: capitalize;
      margin: 0;
      white-space: nowrap;
    }

    .tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(33, 33, 33, 0.95);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: rgba(33, 33, 33, 0.95) transparent transparent transparent;
    }

    .stats-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      padding: 16px;
      background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
      border-radius: 8px;
      margin-top: 20px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 768px) {
      .stats-panel {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-panel {
        grid-template-columns: 1fr;
      }
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    }

    .stat-label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .stat-value {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
    }

    .positive {
      color: #2e7d32;
      background: rgba(46, 125, 50, 0.08);
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    .negative {
      color: #c62828;
      background: rgba(198, 40, 40, 0.08);
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
  `]
})
export class MonthlyWeekdayReturnsChartComponent implements OnInit, OnChanges {
  @Input() request!: WeekdayReturnsRequest;
  @Input() config?: MonthlyWeekdayReturnsChartConfig;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();
  error: string | null = null;

  chartData$!: Observable<MonthlyWeekdayChartData[]>;
  summaryStats$!: Observable<MonthlyWeekdayStats>;
  private maxAbsValue = 0;

  constructor(private monthlyWeekdayService: MonthlyWeekdayReturnsService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['request'] && !changes['request'].firstChange) {
      this.loadData();
    }
  }

  private loadData() {
    if (!this.request) return;

    this.loadingSubject.next(true);
    this.error = null;

    this.chartData$ = this.monthlyWeekdayService.getMonthlyWeekdayReturns(this.request).pipe(
      map(data => {
        const chartData = this.monthlyWeekdayService.transformToChartData(data);
        this.updateMaxValue(chartData);
        return chartData;
      }),
      catchError(err => {
        console.error('Error loading monthly weekday returns:', err);
        this.error = 'Failed to load data. Please try again.';
        throw err;
      }),
      finalize(() => this.loadingSubject.next(false))
    );

    this.summaryStats$ = this.chartData$.pipe(
      map(data => this.monthlyWeekdayService.calculateSummaryStats(data))
    );
  }

  private updateMaxValue(data: MonthlyWeekdayChartData[]) {
    this.maxAbsValue = Math.max(...data.map(d => Math.abs(d.value)));
  }

  getBackgroundColor(value: number): string {
    const intensity = Math.abs(value) / this.maxAbsValue;
    if (value > 0) {
      return `rgba(76, 175, 80, ${intensity * 0.5})`; // Green for positive
    } else {
      return `rgba(244, 67, 54, ${intensity * 0.5})`; // Red for negative
    }
  }

  getTextColor(value: number): string {
    const intensity = Math.abs(value) / this.maxAbsValue;
    return intensity > 0.7 ? '#ffffff' : '#000000';
  }

  formatReturn(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  getTooltipText(data: MonthlyWeekdayChartData): string {
    return `${data.month} ${data.displayName}: ${this.formatReturn(data.value)}`;
  }
}
