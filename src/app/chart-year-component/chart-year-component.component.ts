import {Component, EventEmitter, HostListener, OnInit, Output, Type} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {StockDataService} from "../services/stock-data.service";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import annotationPlugin from "chartjs-plugin-annotation";

@Component({
  selector: 'app-chart-year-component',
  templateUrl: './chart-year-component.component.html',
  styleUrls: ['./chart-year-component.component.css']
})
export class ChartYearComponentComponent implements OnInit {
  @Output() valueChanged = new EventEmitter<string>();

  public chart: any;
  resizeEvent = new Subject<void>();

  public election: string = 'elec';
  public stockName: string = 'SP500';
  canvasId: string;

  stockSymbols: string[] = [
    "AUDUSD", "BRENT", "BTCUSD", "COPPER", "CORN", "DAX",
    "DOW_JONES", "DXY", "EURUSD", "GAS", "GASOLINE", "GBPUSD",
    "GOLD", "NASDAQ_100", "NIKKEI_225", "NZDUSD", "PLATINUM",
    "SILVER", "SOYBEANS", "SP500", "USDCAD", "USDCHF", "USDJPY",
    "WHEAT", "WTI"
  ];

  values: number[] = [];

  constructor(public stockDataService: StockDataService) {
    this.resizeEvent.pipe(
      debounceTime(300) // Wait for 300ms pause in events to avoid thrashing
    ).subscribe(() => {
      this.createChart();
    });
  }

  ngOnInit(): void {
    this.canvasId = 'chart-year-component-' + Math.random().toString(36).substring(2, 15);
    this.createChart();

  }

  async getData() {
    this.createChart();
    this.valueChanged.emit(this.stockName);
  }

  ngOnDestroy() {
    this.resizeEvent.unsubscribe();
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeEvent.next();
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
      let responseLabel: string = response.data[0].name;
      let responseValues: any [] = [];
      response.data.forEach((item: any) => {
        responseValues.push(item.value);

      });
      this.values = responseValues;
      const dailyLabels = this.generateDailyLabels(2023)
      const tempData = Array.from({length: 365}, () => Math.floor(Math.random() * 20) + 10);
      const cloudData = Array.from({length: 365}, () => Math.floor(Math.random() * 100));

      // this.stockDataService.getStockYearAllDaily('GBPUSD').subscribe((response: any) => {
      if (this.chart) {
        this.chart.destroy();
      }
      Chart.register(annotationPlugin);

      let years: string = this.stockName + ' ' +response.data[0].rangeValue + ' years';
      if(this.election != 'regular'){
        years = this.stockName + ' ' + 6 + ' years';
      }

      this.chart = new Chart(this.canvasId, {
        type: 'line',
        data: {
          labels: dailyLabels,
          datasets: [
            {
              label: years,
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
            annotation: {
              annotations: {
                watermark: {
                  type: 'label',
                  position: 'center',
                  color: 'rgba(0, 0, 0, 0.2)',
                  opacity: 0.05,
                  // backgroundColor: 'rgba(0, 0, 0, 0.05)', // low opacity
                  content: 'macro.berezini.com',
                  font: {
                    size: 100,
                    style: 'normal',
                    family: 'Fantasy'
                  },
                  textAlign: 'center'
                }
              }
            },
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
  }
}
