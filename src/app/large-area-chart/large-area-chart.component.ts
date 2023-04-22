import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { StockDataService } from '../services/stock-data.service';

@Component({
  selector: 'app-large-area-chart',
  templateUrl: './large-area-chart.component.html',
  styleUrls: ['./large-area-chart.component.css']
})
export class LargeAreaChartComponent {

  symbol: string = 'MSFT'; // Add a new property to hold the user input

  chartOption!: echarts.EChartsOption;


  constructor(private stockDataService: StockDataService) {

    this.stockDataService.getStockAllDailyData(this.symbol).subscribe((data: any) => {
      debugger
      this.chartOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        },
        yAxis: {
          type: 'value',
          // min: 0,
          // max: 100,          
          axisLabel: {
            formatter: '{value} %'
          },
        },
        series: [{
          data: data,//response
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(58,77,233,0.8)'
              },
              {
                offset: 1,
                color: 'rgba(58,77,233,0.3)'
              }
            ])
          },
        }]
      }
    });
  }

}