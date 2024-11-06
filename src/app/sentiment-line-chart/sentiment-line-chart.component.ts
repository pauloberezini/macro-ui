import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import {MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";

Chart.register(...registerables, zoomPlugin); // Register Chart.js plugins

@Component({
  selector: 'app-sentiment-line-chart',
  templateUrl: './sentiment-line-chart.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    FlexModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule
  ],
  styleUrls: ['./sentiment-line-chart.component.css']
})
export class SentimentLineChartComponent implements OnInit, OnChanges {

  @Input() sentimentData: any[] = [];
  @Input('title-chart') titleChart!: string;
  chart!: Chart;

  ngOnInit(): void {
    if (this.sentimentData.length) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sentimentData'] && this.sentimentData.length) {
      this.createChart(); // Re-render chart if sentimentData changes
    }
  }
  resetZoom(): void {
    if (this.chart) {
      this.chart.resetZoom(); // Reset the zoom and pan to initial state
    }
  }
  private createChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy the old chart before creating a new one
    }

    const dates = this.sentimentData.map(item => new Date(item.date));
    const sentimentPoints = this.sentimentData.map(item => item.totalSentimentPoint);

    // Find the sentiment for the current day, if available
    const today = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
    const todaySentiment = this.sentimentData.find(item => item.date.startsWith(today))?.totalSentimentPoint;
    const label = todaySentiment !== undefined ? `Today’s Sentiment: ${todaySentiment.toFixed(1)}` : 'Total Sentiment Point';

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: label, // Update label based on current day sentiment
            data: sentimentPoints,
            fill: false,
            borderColor: 'blue',
            tension: 0.1,
            borderWidth: 1.5
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x', // Only allow horizontal panning
            },
            zoom: {
              wheel: {
                enabled: true, // Enable zooming with the mouse wheel
              },
              pinch: {
                enabled: true // Enable zooming with pinch gestures on touch screens
              },
              mode: 'x', // Only allow horizontal zooming
            }
          }
        }
      }
    };

    this.chart = new Chart('sentimentChart', config);
  }

}
