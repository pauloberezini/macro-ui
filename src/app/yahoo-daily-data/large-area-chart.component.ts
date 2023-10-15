import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { StockDataService } from '../services/stock-data.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-large-area-chart',
  templateUrl: './large-area-chart.component.html',
  styleUrls: ['./large-area-chart.component.css']
})
export class LargeAreaChartComponent {

  symbol: string = 'GBPUSD=X'; // Add a new property to hold the user input
  selectedMonth: string = '04'; // Add a new property to hold the user input
  months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];
  data: any =[];

  chartOption!: echarts.EChartsOption;
  stockDataService: StockDataService;

  constructor(private service: StockDataService, public dialog: MatDialog) {
    this.stockDataService = service;
  }

  getData(): void {
    this.data = [];
    this.stockDataService.getStockAllDailyData(this.symbol, this.selectedMonth).subscribe((response: any) => {
      this.openDialog(response.errorMsg);
       this.data = response.data;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] = this.data[i] + 10;

      }

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
          data: response.data,//response
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
  openDialog(arg: any) {
    if (arg == '') {
      return;
    }
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        message: arg,
      },
    });
  }
}
