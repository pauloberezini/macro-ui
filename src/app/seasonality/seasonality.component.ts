import {Component, ViewChild} from '@angular/core';
import {LargeAreaChartComponent} from "../yahoo-daily-data/large-area-chart.component";
import {LineChartComponent} from "../yahoo-monthly-data/line-chart.component";
import {PieAreaComponent} from "../pie-area/pie-area.component";
import {ChartYearComponentComponent} from "../chart-year-component/chart-year-component.component";

@Component({
  selector: 'app-seasonality',
  templateUrl: './seasonality.component.html',
  styleUrls: ['./seasonality.component.css']
})
export class SeasonalityComponent {
  @ViewChild(LargeAreaChartComponent) largeAreaChartComponent!: LargeAreaChartComponent;
  @ViewChild(LineChartComponent) lineChartComponent!: LineChartComponent;
  @ViewChild(PieAreaComponent) pieAreaComponent!: PieAreaComponent;
  @ViewChild(ChartYearComponentComponent) chartYearComponentComponent!: ChartYearComponentComponent;

  hidePie: boolean = true;
  selectedStockSymbol: string = 'SP500';
  election: string = '';
  stockSymbols: string[] = [
    "AUDUSD", "BRENT", "BTCUSD", "COPPER", "CORN", "DAX",
    "DOW_JONES", "DXY", "EURUSD", "GAS", "GASOLINE", "GBPUSD",
    "GOLD", "NASDAQ_100", "NIKKEI_225", "NZDUSD", "PLATINUM",
    "SILVER", "SOYBEANS", "SP500", "USDCAD", "USDCHF", "USDJPY",
    "WHEAT", "WTI"
  ];
  months: any = [
    {label: 'January', value: '01'},
    {label: 'February', value: '02'},
    {label: 'March', value: '03'},
    {label: 'April', value: '04'},
    {label: 'May', value: '05'},
    {label: 'June', value: '06'},
    {label: 'July', value: '07'},
    {label: 'August', value: '08'},
    {label: 'September', value: '09'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'}
  ];
  selectedMonth: string = '04';

  ngOnInit() {
    // Get the current month and set it to selectedMonth
    const currentMonth = new Date().getMonth() + 1; // +1 because getMonth() returns a zero-based value (0 for January, 1 for February, and so on)
    this.selectedMonth = currentMonth < 10 ? '0' + currentMonth : '' + currentMonth;
  }

  getData(): void {
    // this.largeAreaChartComponent.stockSymbol = this.stockSymbol;
    // this.largeAreaChartComponent.selectedMonth = this.selectedMonth;
    // this.largeAreaChartComponent.getData();

    this.chartYearComponentComponent.stockName = this.selectedStockSymbol;
    this.chartYearComponentComponent.election = this.election;
    this.chartYearComponentComponent.createChart();

   // this.lineChartComponent.stockSymbol = this.selectedStockSymbol;
   // this.lineChartComponent.getData();

    this.hidePie = false;
    if (this.pieAreaComponent) {
      this.pieAreaComponent.createPieChart();
    }

  }
}
