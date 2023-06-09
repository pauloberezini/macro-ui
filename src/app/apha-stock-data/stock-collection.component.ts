import { Component } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { StockDataService } from '../services/stock-data.service';
import { SpinnerService } from '../services/spinner/spinner.component';

@Component({
  selector: 'app-stock-collection',
  templateUrl: './stock-collection.component.html',
  styleUrls: ['./stock-collection.component.css']
})
export class StockCollectionComponent {
  
  isLoading$ = this.spinnerService.loading$;
  public period!: string;
  public chart: any;
  chartStyle: string = 'bar';
  symbol: string = 'MSFT'; // Add a new property to hold the user input
  fromYear: number = 2000; // Add a new property to hold the user input
  currentYear: number = new Date().getFullYear();
  toYear: number = this.currentYear - 1; // Add a new property to hold the user input


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
  dataSource: any;

  constructor(private stockDataService: StockDataService, public spinnerService: SpinnerService) { }
  ngOnChanges() { }

  ngOnInit(): void { }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("MyChartLine", {
      type: this.chartTypes[this.chartStyle], //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],
        datasets: [
          {
            label: this.period,
            data: this.getAverageValues(this.seasonalityAvg),
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });

  }
  getAverageValues(data: any[]): number[] {
    const averages: number[] = [];

    for (const item of data) {
      averages.push(item.average);

    }
    return averages;
  }

  getStockData(): void {
    this.stockDataService.getStockAlphaData(this.symbol).subscribe((response: any) => {
      this.dataSource = response.data;
      this.period = response.message;
      this.seasonDataAvg();
      this.seasonDataAll();
      
    });
  }

  seasonDataAvg(): void {
    const data = this.dataSource; // Use the dataSource instead of stockData
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
    const data = this.dataSource; // Use the dataSource instead of stockData
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
