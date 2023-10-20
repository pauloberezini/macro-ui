import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-pie-area',
  templateUrl: './pie-area.component.html',
  styleUrls: ['./pie-area.component.css']
})
export class PieAreaComponent implements AfterViewInit {

  private chartInstance?: Chart;


  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.createPieChart();
  }

  createPieChart() {
    const randomizedData = this.generateRandomData();

    const data = {
      labels: ['Lose', 'Risk', 'Profit'],
      datasets: [{
        data: randomizedData,
        backgroundColor: ['#6ec1e4', '#00a7a7', '#102f77'],
      }]
    };

    const pieCanvas = this.elementRef.nativeElement.querySelector('#pieCanvas');

    // If a chart instance exists, destroy it to remove the old pie chart
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Create a new pie chart
    this.chartInstance = new Chart(pieCanvas, {
      type: 'pie',
      data: data,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label;
                const value = context.parsed;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    }) as Chart;

  }

  generateRandomData(): number[] {
    let first = Math.floor(Math.random() * 100);
    let second = Math.floor(Math.random() * (100 - first));
    let third = 100 - first - second;

    return [first, second, third];
  }
}
