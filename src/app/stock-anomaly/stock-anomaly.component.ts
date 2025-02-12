import { Component, ViewChild, ElementRef, AfterViewInit, signal, WritableSignal } from '@angular/core';
import { StockAnalysisModel, StockAnalysisService } from '../services/stock-analysis.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { MatToolbarModule } from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-stock-anomaly',
  standalone: true,
  templateUrl: './stock-anomaly.component.html',
  imports: [NgIf, FormsModule, MatToolbarModule, MatButtonModule, MatCardModule]
})
export class StockAnomalyComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart | null; // Allows null to handle destruction

  ticker: WritableSignal<string> = signal('SLV');

  constructor(private stockService: StockAnalysisService) {}

  ngAfterViewInit() {
    this.initChart([], [], []); // Initialize an empty chart
  }

  analyzeStock() {
    this.stockService.analyzeStock(this.ticker()).subscribe({
      next: (data: StockAnalysisModel) => {
        console.log('Received stock data:', data);

        try {
          if (data.graph_data?.data?.length) {
            const mainTrace = data.graph_data.data.find((trace: { name: string; }) => trace.name === "Test MSE");
            const thresholdTrace = data.graph_data.data.find((trace: { name: string; }) => trace.name === "Threshold");

            if (!mainTrace || !mainTrace.x || !mainTrace.y) {
              console.error("Invalid mainTrace data");
              return;
            }

            const xValues = mainTrace.x.map((date: string) =>
              new Date(date).toISOString().split('T')[1].slice(0, 5)
            );

            const yValues = mainTrace.y.filter((v: number) => v !== null && !isNaN(v)); // Remove NaN values
            const thresholdYValues = thresholdTrace && thresholdTrace.y.length
              ? new Array(yValues.length).fill(thresholdTrace.y[0])
              : [];

            console.log("Processed X values:", xValues);
            console.log("Processed Y values:", yValues);
            console.log("Threshold Y values:", thresholdYValues);

            this.updateChart(xValues, yValues, thresholdYValues);
          } else {
            console.error('Invalid graph_data:', data.graph_data);
          }
        } catch (error) {
          console.error('Error processing graph data:', error);
        }
      },
      error: (err: any) => {
        console.error('Error fetching stock data:', err);
      }
    });
  }

  initChart(labels: string[], data: number[], thresholdData: number[]) {
    if (this.chart) {
      this.chart.destroy(); // Destroy the previous instance before creating a new one
      this.chart = null;
    }

    const canvas = this.chartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Completely reset the canvas before rendering a new chart
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
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            tension: 0.4,
            fill: 'start'
          },
          {
            label: 'Threshold',
            data: thresholdData,
            borderColor: 'rgb(255, 99, 132)',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false
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
            beginAtZero: true, // Ensure the Y-axis starts at zero
            min: minY - 2, // Force Y-axis lower bound
            max: maxY + 2 // Force Y-axis upper bound
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
