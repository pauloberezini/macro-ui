import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChartData, ChartType} from 'chart.js';
import {Chart} from "chart.js/auto";
import {StockDataService} from "../services/stock-data.service";
import {NewsSentiment} from "../model/news-sentiment";
import {Observable} from "rxjs";
import {FlexModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {DataMessageComponent} from "../util/data-message/data-message.component";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  standalone: true,
  imports: [
    FlexModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    NgIf,
    MatListModule,
    DataMessageComponent
  ],
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit, OnInit {

  public chart: any;
  public newsSentiment: Observable<NewsSentiment>;
  public noDataAvailable: boolean = true;
  public showChart: boolean = true;

  public negativeSum: number = 0;
  public positiveSum: number = 0;
  public neutralSum: number = 0;
  public allSum: number = 0;
  @Input() period!: string;
  public canvasId: string;
  @Input('title-chart') titleChart!: string;


  constructor(public service: StockDataService) {
  }

  ngOnInit(): void {
    this.canvasId = 'pie-chart-component-' + Math.random().toString(36).substring(2, 15);
    if (this.period != '') {
      this.newsSentiment = this.service.getChartSentiment(this.period);
    }

  }


  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    const sentiment: number[] = [];
    if (this.newsSentiment) {
      this.newsSentiment.subscribe(value => {
        this.negativeSum = value.negativeSum;
        this.positiveSum = value.positiveSum;
        this.neutralSum = value.neutralSum;
        this.allSum = value.allSum;

        // Check if there's already a chart and destroy it
        if (this.chart) {
          this.chart.destroy();
        }

        if (value.allSum == 0) {
          this.showChart = false;
          return;
        } else {
          this.noDataAvailable = false;
        }

        // Initialize the new chart on the canvas
        this.chart = new Chart(this.canvasId, {
          type: 'pie', // This denotes the type of chart
          data: {
            labels: ['Negative', 'Positive', 'Neutral'],
            datasets: [{
              label: 'AI Sentiment',
              data: [this.negativeSum, this.positiveSum, this.neutralSum],
              backgroundColor: [
                '#F44336',
                '#4CAF50',
                '#2196F3',
              ],
              hoverOffset: 4
            }],
          },
          options: {
            aspectRatio: 2.5
          }
        });
      });
    } else {
      throw new Error('newsSentiment is not available');
    }
  }

}
