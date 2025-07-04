import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {Chart, ChartType} from 'chart.js/auto';
import moment from 'moment';
import 'chartjs-adapter-moment';
import {DataMessageComponent} from "../util/data-message/data-message.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-economic-data',
  templateUrl: './economic-data.component.html',
  standalone: true,
  imports: [
    DataMessageComponent,
    NgIf
  ],
  styleUrls: ['./economic-data.component.css']
})
export class EconomicDataComponent implements OnInit {
  @Input() selectedRowData: any;
  showChart: boolean = false;
  @Input() economicType!: string;
  @ViewChild("atrChart") atrChart: ElementRef;
  years: number[] = [];
  selectedYear!: number;
  chartStyle: string = 'bar';
  chartTypes: { [key: string]: ChartType } = {
    bar: "bar",
    line: "line"
  };

  chart: Chart;
  chartData: any[] = [];
  noDataAvailable: boolean = true;


  constructor(public service: StockDataService) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
    this.selectedYear = currentYear;
  }

  onYearChange(year: number) {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRowData'] && this.selectedRowData) {
      this.showChart = true;
      const inputString = this.selectedRowData.eventName;

      const regex = /\([^)]+\)/g;
      const wordsInBrackets = inputString.match(regex);

      if (wordsInBrackets && wordsInBrackets.length > 0) {
        let arr = this.selectedRowData.eventName.split(' ');
        arr.pop();
        let eventName = arr.join(' ');
        this.request(eventName);
      } else {
        let eventName = this.selectedRowData.eventName;
        this.request(eventName);

      }
    } else {
      this.noDataAvailable = true;
      this.showChart = false;
    }
  }

  request(eventName: string) {
    this.service.getDynamicData(this.selectedRowData.country, eventName).subscribe(response => {
      if (response.success) {
        this.chartData = response.data.map((d: any) => ({
          x: moment(d.time).format('YYYY-MM-DD'),
          y: parseFloat(d.actualInfo)
        }));
        this.noDataAvailable = this.chartData.length === 0;

        this.createChart(this.selectedRowData.eventName);
      }
    });
  }


  createChart(title: string) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.noDataAvailable) {
      return;
    }


    let canvas = this.atrChart.nativeElement;
    // Удалить предыдущие размеры canvas, чтобы Chart.js мог адаптироваться
    canvas.removeAttribute('width');
    canvas.removeAttribute('height');



    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        datasets: [{
          label: title,
          data: this.chartData,
          borderColor: 'rgb(75, 192, 192)'
        }]
      },
      options: {
        responsive: true, // Эта опция обеспечивает адаптивность графика
        maintainAspectRatio: false, // Отключаем поддержание соотношения сторон
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
              display: false,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: false,
              text: '%'
            }
          }
        }
      }
    });

    // Force a resize of the chart after it's created
    this.chart.resize();
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
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

    this.service.getEconomicData(this.economicType).subscribe((response: any) => {
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
