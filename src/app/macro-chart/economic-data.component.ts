import {Component, Input, SimpleChanges} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {Chart, ChartType} from 'chart.js/auto';
import * as moment from 'moment';
import 'chart.js';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-economic-data',
  templateUrl: './economic-data.component.html',
  styleUrls: ['./economic-data.component.css']
})
export class EconomicDataComponent {
  @Input() selectedRowData: any;
  @Input() economicType!: string;
  years: number[] = [];
  selectedYear!: number;
  chartStyle: string = 'bar';
  chartTypes: { [key: string]: ChartType } = {
    bar: "bar",
    line: "line"
  };

  stockDataService: StockDataService;

  chart: Chart;
  chartData: any[] = [];

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRowData'] && this.selectedRowData) {
      let arr = this.selectedRowData.eventName.split(' ');
      arr.pop();
      let eventName = arr.join(' ');
      this.stockDataService.getDynamicData(this.selectedRowData.country, eventName).subscribe(response => {
        if (response.success) {
          this.chartData = response.data.map((d: any) => ({
            x: moment(d.time).format('YYYY-MM'), // Format date to only show year and month
            y: parseFloat(d.actualInfo)
          }));

          this.createChart(this.selectedRowData.eventName);
        }
      });
    }
  }


  createChart(title:string) {
    debugger
    if (this.chart) {
      this.chart.destroy();
    }
    const canvas = <HTMLCanvasElement>document.getElementById('atrChart');
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: title,
          data: this.chartData,
          borderColor: 'rgb(75, 192, 192)'
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                const index = context[0].dataIndex;
                const value = context[0].dataset.data[index];
                return moment(value).format('MMM YYYY');
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: 'MMM YYYY'
              }
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: '%'
            }
          }
        }
      }

    });
  }

  ngOnInit(): void {
    // this.getData();
    // getEconomicData
  }

  getData(): void {

    if (this.chart) {
      this.chart.destroy();
    }
    type RecordType = {
      id: number,
      year: number,
      period: string,
      consumerPriceIndex: number,
      overTheYearPercentChange: number,
      overTheMonthPercentChange: number
    };

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
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
