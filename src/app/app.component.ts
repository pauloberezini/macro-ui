import { Component, OnInit } from '@angular/core';
import { StockDataService } from './services/stock-data.service';


export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['date', 'open', 'high', 'low', 'close', 'volume', 'adjustedClose'];
  seasonalityAvgColumns: string[] = ['month', 'average'];
  monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  selectedValue: string = 'line';
  
  dataSource: any;
  symbol: string = 'GBPUSD=X'; // Add a new property to hold the user input
  fromYear: number = 2000; // Add a new property to hold the user input
  currentYear: number = new Date().getFullYear();
  toYear: number = this.currentYear - 1; // Add a new property to hold the user input
  seasonality: any = [];
  seasonalityAvg: any = [];
  averages: any = [];



  constructor(private stockDataService: StockDataService) { }

  ngOnInit(): void {
    //todo delete?
  }
  getStockData(symbol: string, fromYear: number, toYear: number): void {
    this.stockDataService.getStockData(symbol, fromYear, toYear).subscribe((data: any) => {
      this.dataSource = data;
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
      console.log(this.toYear - this.fromYear);
    }
    debugger
    this.seasonalityAvg = Array.from(seasonalityAvg.values());
  }

  seasonDataAll(): void {
    const data = this.dataSource; // Use the dataSource instead of stockData
    const seasonalityMap = new Map();
    for (const monthlyData of data) {
      const [year, month] = monthlyData.date.split('-');
      const yearKey = `${year}`;
      // const monthKey = `${year}`+'-'+`${month}`;


      if (!seasonalityMap.has(yearKey)) {
        seasonalityMap.set(yearKey, []);
      }
      let item = {
        month: month,
        year: year,
        average: ((monthlyData.close - monthlyData.open) * 100)
      }
      let arr = seasonalityMap.get(yearKey);
      arr.push(item);
    }
    const sortedValues = Array.from(seasonalityMap.values()).sort((a, b) => a[0].year - b[0].year);

    // Reverse the order of the array to get the data in ascending order
    this.seasonality = sortedValues.reverse();
  }

  getMonthName(monthNum: string): string {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return monthNames[parseInt(monthNum, 10) - 1];
  }
}
