import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {MatDialog} from '@angular/material/dialog';
import {Chart, ChartType} from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import {DateFormatPipe} from "../model/date-format-pipe";
import {MatDividerModule} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-line-chart',
  templateUrl: './seasonality-pro.component.html',
  standalone: true,
  imports: [
    MatDividerModule,
    MatSelectModule,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./seasonality-pro.component.css']
})
export class SeasonalityPro implements AfterViewInit, OnInit, OnChanges {

  @Input() hideForm: boolean = false;

  public chart: any;
  chartStyle: string = 'bar';
  stockSymbol: string = 'GBPUSD=X';
  fromYear: number = 2000;
  currentYear: number = new Date().getFullYear();
  toYear: number = this.currentYear - 1;
  seasonality: any = [];
  seasonalityAvg: any = [];
  chartTypes: { [key: string]: ChartType } = {
    bar: "bar",
    line: "line"
  };

  data: any;
  canvasId: string;
  earliestDate: string;


  constructor(
    private stockDataService: StockDataService,
    public dialog: MatDialog,
    private datefromat: DateFormatPipe
  ) {
  }

  ngAfterViewInit(): void {
    this.canvasId = 'MyChartLine-' + Math.random().toString(36).substring(2, 15);
  }

  ngOnChanges() {
  }


  ngOnInit(): void {
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    Chart.register(annotationPlugin);
    // @ts-ignore
    this.chart = new Chart(this.canvasId, {
      type: this.chartTypes[this.chartStyle],

      data: {// values on X-Axis
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: this.stockSymbol + ' Data Beginning from: ' + this.datefromat.transform(this.earliestDate),
            data: this.getAverageValues(this.seasonalityAvg),
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
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
                  size: 80,
                  style: 'normal',
                  family: 'Fantasy'
                },
                textAlign: 'center'
              }
            }
          }
        }
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

  getData(): void {
    this.data = [];
    this.stockDataService.getStockData(this.stockSymbol, this.fromYear, this.toYear).subscribe((response: any) => {
      debugger
      this.data = response.data;
      this.earliestDate = this.data[0].date;
      this.loadDailyData();
      this.loadMonthlyData();
    });
  }

  loadDailyData(): void {
    const seasonalityAvg = new Map();
    for (const dailyData of this.data) {
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

  loadMonthlyData(): void {
    const arr = new Array();
    let index: number = 1;
    for (const monthlyData of this.data) {
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
