import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-moment'; // Import the chartjs-adapter-moment library

@Component({
  selector: 'app-atr-chart',
  templateUrl: './atr-chart.component.html',
  styleUrls: ['./atr-chart.component.css']
})
export class AtrChartComponent implements OnInit {

  private apiUrl = 'https://www.alphavantage.co/query?function=ATR&symbol=EURUSD&interval=monthly&time_period=10&apikey=XIDSP2AHY2Z6Y8H9'; // Your API URL
  chart: Chart;
  chartData: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.apiUrl).subscribe((data: any) => {
      let atrData = data['Technical Analysis: ATR'];
      let monthlyData = {};

      for (let date in atrData) {
        let yearMonth = date.slice(0,7);  // Extracts the year and month from the date string

        if (monthlyData[yearMonth]) {
          // If the month already exists in monthlyData, add the ATR to it
          monthlyData[yearMonth] += parseFloat(atrData[date]['ATR']);
        } else {
          // Otherwise, initialize the month in monthlyData with the ATR
          monthlyData[yearMonth] = parseFloat(atrData[date]['ATR']);
        }
      }

      let sumByMonth: { [key: string]: number } = {};

      for (let key in monthlyData) {
        let month = key.split('-')[1]; // get the month

        if (!sumByMonth[month]) {
          sumByMonth[month] = 0;
        }

        sumByMonth[month] += monthlyData[key];
      }
      debugger
      // Convert the monthlyData object into an array of objects compatible with Chart.js
      for (let month in sumByMonth) {
        this.chartData.push({
          x: month,
          y: sumByMonth[month]
        });
      }

      // this.chartData = this.chartData.reverse();
      this.chartData.sort(function(a, b) {
        // Extract the month from the x property
        var monthA = new Date(a.x).getMonth();
        var monthB = new Date(b.x).getMonth();

        // Compare the months
        if (monthA < monthB) {
          return -1;
        }
        if (monthA > monthB) {
          return 1;
        }
        return 0;
      });
      this.createChart();
    });
  }


  createChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('atrChart');
    const ctx = canvas.getContext('2d');
    debugger
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'ATR',
          data: this.chartData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            time: {
              parser: 'MM'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'ATR'
            }
          }
        }
      }
    });
  }
}
