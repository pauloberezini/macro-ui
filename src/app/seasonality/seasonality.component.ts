import {Component, ViewChild} from '@angular/core';
import {LargeAreaChartComponent} from "../yahoo-daily-data/large-area-chart.component";
import {LineChartComponent} from "../yahoo-monthly-data/line-chart.component";
import {PieAreaComponent} from "../pie-area/pie-area.component";

@Component({
  selector: 'app-seasonality',
  templateUrl: './seasonality.component.html',
  styleUrls: ['./seasonality.component.css']
})
export class SeasonalityComponent {
  @ViewChild(LargeAreaChartComponent) largeAreaChartComponent!: LargeAreaChartComponent;
  @ViewChild(LineChartComponent) lineChartComponent!: LineChartComponent;
  @ViewChild(PieAreaComponent) pieAreaComponent!: PieAreaComponent;

  hidePie: boolean = true;
  stockSymbol: string = 'GBPUSD=X';
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
    this.largeAreaChartComponent.stockSymbol = this.stockSymbol;
    this.largeAreaChartComponent.getData();

    this.lineChartComponent.stockSymbol = this.stockSymbol;
    this.lineChartComponent.getData();

    this.hidePie = false;
    this.pieAreaComponent.ngAfterViewInit();
  }
}
