import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {
  public chart: any;

  chartTypes: { [key: string]: ChartType } = {
    bar: "bar",
    line: "line"
  };

  @Input()
  seasonalityAvg!: any[];


  @Input()
  chartStyle!: string;

  constructor() {
  }
  ngOnChanges(changes: SimpleChanges) {
    const valueChange = changes['seasonalityAvg'];
    // If no change occured then valueChanges will be undefined.
    if (valueChange) {
      //this.chart.data.datasets[0].data = this.seasonalityAvg;
      this.createChart();
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.createChart();
  }

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
            label: "data",
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
}
