import {Component, HostListener, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {StockDataService} from "../services/stock-data.service";


// Register the dateFnsAdapter with Chart.js

@Component({
  selector: 'app-chart-year-component',
  templateUrl: './chart-year-component.component.html',
  styleUrls: ['./chart-year-component.component.css']
})
export class ChartYearComponentComponent implements OnInit {

  public chart: any;

  public election : string = 'regular';
  public stockName : string = 'SP500';
  canvasId: string;

  values: number[] = [];

  constructor(public stockDataService: StockDataService) {
  }

  ngOnInit(): void {
    this.canvasId = 'chart-year-component-' + Math.random().toString(36).substring(2, 15);
    this.createChart();


  }

  @HostListener('window:resize', ['$event'])
  onResize() {

    if (this.chart) {
      this.chart.destroy();
    }

    this.createChart();
  }

  generateDailyLabels(year: number) {
    const dailyLabels = [];
    for (let month = 0; month < 12; month++) {
      let date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        dailyLabels.push(
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0')
        );
        date.setDate(date.getDate() + 1);
      }
    }
    return dailyLabels;
  }


  createChart() {
    this.stockDataService.getStockAlphaData25(this.stockName, this.election).subscribe((response: any) => {
      debugger
      let responseLabel:string = response.data[0].name;

      let responseValues: any [] = [];
      response.data.forEach((item: any) => {
        // Iterate over each property in the object
        responseValues.push(item.value);

      });
      this.values = responseValues;
      const dailyLabels = this.generateDailyLabels(2023)

      const tempData = Array.from({length: 365}, () => Math.floor(Math.random() * 20) + 10);
      const cloudData = Array.from({length: 365}, () => Math.floor(Math.random() * 100));

      // this.stockDataService.getStockYearAllDaily('GBPUSD').subscribe((response: any) => {
      debugger
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.canvasId, {
        type: 'line',
        data: {
          labels: dailyLabels,
          datasets: [
            {
              label: responseLabel,
              data: responseValues,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 0.1,
              pointBackgroundColor: 'rgb(255, 99, 132)',
              tension: 0.4,
              pointStyle: false,
              fill: 'start'
            }
            // ,          {
            //   label: "Cloud Coverage(%) in Lahore",
            //   data: cloudData,
            //   borderColor: 'rgb(54, 162, 235)',
            //   backgroundColor: 'rgba(54, 162, 235, 0.2)',
            //   borderWidth: 2,
            //   pointBackgroundColor: 'rgb(54, 162, 235)',
            // }
          ]
        },
        options: {
          aspectRatio: 2.5,
          animations: {
            radius: {
              duration: 0.1,
              easing: 'linear',
              loop: (context) => context.active
            }
          },

          interaction: {
            intersect: false,
          },
          elements: {
            line: {
              tension: 0.5
            },
          },

          scales: {
            y: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              }
            },
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 12
              }
            }
          },
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              bodyFont: {
                size: 14,
              },
              titleFont: {
                size: 16,
                weight: 'bold',
              }
            },
            legend: {
              labels: {
                font: {
                  size: 14,
                }
              }
            }
          }
        }
      });
    });


    // })


  }
}
