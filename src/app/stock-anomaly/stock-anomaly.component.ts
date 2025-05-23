import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  signal,
  WritableSignal,
  ChangeDetectorRef
} from '@angular/core';
import {StockAnalysisModel, StockAnalysisService} from '../services/stock-analysis.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import Chart from 'chart.js/auto';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Observable} from "rxjs";
import {SpinnerService} from "../services/spinner/spinner.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";

@Component({
  selector: 'app-stock-anomaly',
  standalone: true,
  templateUrl: './stock-anomaly.component.html',
  imports: [FormsModule, MatToolbarModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, AsyncPipe, NgIf, MatProgressSpinnerModule, MatGridListModule]
})
export class StockAnomalyComponent {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  public chart: any;

  stockSymbol: string = 'BTC-USD';
  anomaly_count: number;
  isAnalyzing: boolean = false;
  loading$: Observable<boolean>; // Observable for spinner state

  constructor(private stockService: StockAnalysisService, public spinnerService: SpinnerService, private cdr: ChangeDetectorRef) {
    this.spinnerService.loading$.subscribe(loading => console.log('Spinner state:', loading));
    this.loading$ = this.spinnerService.loading$;
  }

  loadData() {
    if (this.isAnalyzing) return; // Prevent multiple clicks

    this.isAnalyzing = true; // Disable button before request

    this.stockService.analyzeStock(this.stockSymbol).subscribe({
      next: (data: StockAnalysisModel) => {
        console.log('Received stock data:', data);

        try {
          if (data.graph_data?.data?.length) {
            this.anomaly_count = data.anomaly_count;
            const mainTrace = data.graph_data.data.find((trace: { name: string }) => trace.name === 'Test MSE');
            const thresholdTrace = data.graph_data.data.find((trace: { name: string }) => trace.name === 'Threshold');

            if (!mainTrace || !mainTrace.x || !mainTrace.y) {
              console.error('Invalid mainTrace data');
              return;
            }

            const xValues = mainTrace.x.map((date: string) =>
              new Date(date).toISOString().split('T')[1].slice(0, 5)
            );

            const yValues = mainTrace.y.filter((v: number) => v !== null && !isNaN(v)); // Remove NaN values
            const thresholdYValues =
              thresholdTrace && thresholdTrace.y.length ? new Array(yValues.length).fill(thresholdTrace.y[0]) : [];

            console.log('Processed X values:', xValues);
            console.log('Processed Y values:', yValues);
            console.log('Threshold Y values:', thresholdYValues);

            this.updateChart(xValues, yValues, thresholdYValues);

            this.cdr.detectChanges(); // Manually trigger change detection
          } else {
            console.error('Invalid graph_data:', data.graph_data);
          }
        } catch (error) {
          console.error('Error processing graph data:', error);
        }
      },
      error: (err: any) => {
        console.error('Error fetching stock data:', err);
      },
      complete: () => {
        this.isAnalyzing = false; // Re-enable button after request completes
      },
    });
  }


  initChart(labels: string[], data: number[], thresholdData: number[]) {
    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart instance before creating a new one
      this.chart = null;
    }

    const canvas = this.chartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Reset canvas before rendering new chart
    canvas.width = canvas.width;
    canvas.height = canvas.height;

    const hasData = data.length > 0;
    const minY = hasData ? Math.min(...data, ...thresholdData) : 0;
    const maxY = hasData ? Math.max(...data, ...thresholdData) : 10; // Default Y range when no data

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Test MSE',
            data: data,
            borderColor: 'rgb(54, 162, 235)', // Blue line for Test MSE
            borderWidth: 2, // Visible line thickness
            pointRadius: 0, // Remove dots for a clean line
            tension: 0.4, // Make it slightly curved (or set to 0 for a straight line)
            fill: false // No fill under the line
          },
          {
            label: 'Threshold',
            data: thresholdData,
            borderColor: 'rgb(255, 99, 132)', // Red line for Threshold
            borderWidth: 2, // Make it bold
            borderDash: [], // Ensure a solid line
            pointRadius: 0, // Remove points for a smooth straight line
            tension: 0, // Keep it perfectly straight
            fill: false // No fill under the line
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { intersect: false },
        animation: { duration: 0 },
        scales: {
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: { autoSkip: true, maxTicksLimit: 12 }
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            beginAtZero: true,
            min: minY - 2, // Ensure Y-axis starts below the min value
            max: maxY + 2 // Ensure Y-axis ends above the max value
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => tooltipItems.length ? tooltipItems[0].label : '',
              label: (context) => `MSE: ${context.parsed.y}`
            }
          },
          legend: { labels: { font: { size: 14 } } }
        }
      }
    });
  }


  updateChart(labels: string[], data: number[], thresholdData: number[]) {
    this.initChart(labels, data, thresholdData);
  }
}
