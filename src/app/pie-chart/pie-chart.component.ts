import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  standalone: true,
  imports: [
    FlexModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    NgIf
  ],
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit, OnInit {

  public chart: any;
  public newsSentiment: Observable<NewsSentiment>;
  public noDataAvailable: boolean = true;
  public showChart: boolean = true;

  constructor(public service: StockDataService) {
  }

  ngOnInit(): void {
    this.newsSentiment = this.service.getDailySentiment();
  }


  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    const sentiment: number[] = [];
    if (this.newsSentiment) {
      this.newsSentiment.subscribe(value => {
        // Assuming value.negativeSum is the number you want to push into the sentiment array
        sentiment.push(value.negativeSum);
        sentiment.push(value.positiveSum);
        sentiment.push(value.neutralSum);
        if (value.allSum == 0) {
          this.showChart = false;
          return;
        }else {
          this.noDataAvailable = false;
        }
        // You might want to do something here to update the chart with the new sentiment value
        this.chart = new Chart("pie", {
          type: 'pie', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: ['Negative', 'Positive', 'Neutral'],
            datasets: [{
              label: 'AI Sentiment',
              data: sentiment,
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
