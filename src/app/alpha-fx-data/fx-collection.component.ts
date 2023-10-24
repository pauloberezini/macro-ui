import {ChangeDetectorRef, Component} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {Chart, ChartType} from 'chart.js/auto';

@Component({
  selector: 'fx-collection',
  templateUrl: './fx-collection.component.html',
  styleUrls: ['./fx-collection.component.css']
})
export class FxCollectionComponent {

  public chart: any;
  chartStyle: string = 'bar';
  public period!: string;
  symbol: string = 'GBPUSD'; // Add a new property to hold the user input
  fromYear: number = 2000; // Add a new property to hold the user input
  currentYear: number = new Date().getFullYear();
  toYear: number = this.currentYear - 1; // Add a new property to hold the user input
  public canvasId: string = 'fx_collection_' + this.getRandomId();

  seasonality: any = [];
  seasonalityAvg: any = [];
  averages: any = [];

  chartTypes: { [key: string]: ChartType } = {
    bar: "bar",
    line: "line"
  };

  seasonalityAvgColumns: string[] = ['month', 'average'];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // displayedColumns: string[] = ['Year', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  displayedColumns: string[] = ['position', 'year', 'month', 'average'];
  data: any;

  constructor(private stockDataService: StockDataService, private cdr: ChangeDetectorRef) {
  }

  ngOnChanges() {
  }

  ngOnInit(): void {
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    this.canvasId = 'fx_collection_' + this.getRandomId();

    // Detect changes to update the view immediately
    this.cdr.detectChanges();

    setTimeout(() => {
      this.chart = new Chart(this.canvasId, {
        type: this.chartTypes[this.chartStyle], //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],
          datasets: [
            {
              label: this.symbol,
              data: this.getAverageValues(this.seasonalityAvg),
              backgroundColor: 'blue'
            }
          ]
        },
        options: {
          aspectRatio: 2.5,
          scales: {
            x: {
              display: true,
              title: {
                display: true
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Value'
              }
            }
          }
        }
      });
    });

  }

  getAverageValues(data: any[]): number[] {
    const averages: number[] = [];

    for (const item of data) {
      averages.push(item.average);

    }
    return averages;
  }

  getRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getStockData(): void {
    this.data = [];
    this.stockDataService.getFXData(this.symbol).subscribe((response: any) => {
      this.data = response.data;
      this.period = response.message;
      this.seasonDataAvg();
      this.seasonDataAll();
    });
  }

  seasonDataAvg(): void {
    const data = this.data; // Use the data instead of stockData
    const seasonalityAvg = new Map();
    for (const dailyData of data) {
      const [year, month] = dailyData.date.split('-');
      const monthKey = `${month}`;

      if (!seasonalityAvg.has(monthKey)) {
        seasonalityAvg.set(monthKey, {
          month: this.getMonthName(month),
          average: 0
        });
      }

      seasonalityAvg.get(monthKey).average += ((dailyData.close - dailyData.open) * 100) / dailyData.open;
    }
    for (const map of seasonalityAvg) {
      map[1].average = map[1].average / (this.toYear - this.fromYear);
    }
    this.seasonalityAvg = Array.from(seasonalityAvg.values());
  }

  seasonDataAll(): void {
    const data = this.data; // Use the data instead of stockData
    const arr = new Array();
    let index: number = 1;
    for (const monthlyData of data) {
      const [year, month] = monthlyData.date.split('-');


      let item = {
        position: index,
        month: month,
        year: year,
        average: ((monthlyData.close - monthlyData.open) * 100)
      }
      arr.push(item);
      index++;
    }

    // Reverse the order of the array to get the data in ascending order
    this.seasonality = arr.sort((a, b) => b.year.localeCompare(a.year));
    this.createChart();
  }

  getMonthName(monthNum: string): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[parseInt(monthNum, 10) - 1];
  }
}
