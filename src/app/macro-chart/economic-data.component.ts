import { Component, Input } from '@angular/core';
import { StockDataService } from '../services/stock-data.service';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-economic-data',
  templateUrl: './economic-data.component.html',
  styleUrls: ['./economic-data.component.css']
})
export class EconomicDataComponent {

  @Input()
  economicType!: string;
  years: number[] = [];
  selectedYear!: number;
  chartStyle: string = 'bar';
  chartTypes: { [key: string]: ChartType } = {
    bar: "bar",
    line: "line"
  };

  stockDataService: StockDataService;
  public chart: any;

  constructor(public service: StockDataService) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
    this.selectedYear = currentYear;
    this.stockDataService = service;
  }
  onYearChange(year: number) {
    this.getData();
  }

  ngOnInit(): void {
    this.getData();
    // getEconomicData
  }
  getData(): void {

    if (this.chart) {
      this.chart.destroy();
    }
    type RecordType = { id: number, year: number, period: string, consumerPriceIndex: number, overTheYearPercentChange: number, overTheMonthPercentChange: number };

    this.stockDataService.getEconomicData(this.economicType).subscribe((response: any) => {
      const dataselectedYear = response.data.filter((record: RecordType) => record.year === this.selectedYear);

      // Ensure that data is sorted in chronological order
      const sortedDataselectedYear = dataselectedYear.sort((a: RecordType, b: RecordType) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months.indexOf(a.period) - months.indexOf(b.period);
      });

      // Extract overTheYearPercentChange for each month
      const cpiDataselectedYear = sortedDataselectedYear.map((record: RecordType) => record.overTheYearPercentChange);

      this.chart = new Chart('Inflation', {
        type: this.chartTypes[this.chartStyle], //this denotes tha type of chart
        data: {// values on X-Axis
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: "CPI Inflation",
              data: cpiDataselectedYear,
              backgroundColor: 'blue'
            }
          ]
        },
        options: {
          aspectRatio: 2.5
        }
      });
    });
  }
}