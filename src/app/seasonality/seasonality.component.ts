import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {LargeAreaChartComponent} from "../yahoo-daily-data/large-area-chart.component";
import {LineChartComponent} from "../yahoo-monthly-data/line-chart.component";
import {PieAreaComponent} from "../pie-area/pie-area.component";
import {ChartYearComponentComponent} from "../chart-year-component/chart-year-component.component";
import {Meta} from "@angular/platform-browser";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

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

  gridCols: number;
  grid = { cols: 4, rowHeight: '2:1' };

  constructor(private metaTagService: Meta, private breakpointObserver: BreakpointObserver,private cdRef: ChangeDetectorRef) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.grid.cols = 1;
          this.grid.rowHeight = '1:1';
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.grid.cols = 2;
          this.grid.rowHeight = '1.5:1';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.grid.cols = 3;
          this.grid.rowHeight = '1.75:1';
        } else {
          this.grid.cols = 4;
          this.grid.rowHeight = '2:1';
        }
      }
    });
  }

  hidePie: boolean = true;
  selectedStockSymbol: string = 'SP500';
  election: string = 'pre';
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
    this.metaTagService.addTags([
      {
        name: 'description',
        content: 'Explore historical market trends with Berezini Partners’ Seasonal Trading Pattern Analytics. Uncover patterns and make informed trading decisions based on SP500 historical seasonality.'
      },
      {
        name: 'keywords',
        content: 'seasonality analysis, market trends, historical trading patterns, SP500 seasonality, trading insights, Berezini Partners, stock market analysis, trading strategies'
      },
      {property: 'og:title', content: 'Seasonal Trading Pattern Analytics | Berezini Partners'},
      {
        property: 'og:description',
        content: 'Dive into SP500 historical seasonality and trading patterns. Berezini Partners offers advanced analytics to spot trends and strategize your trades.'
      },
      {property: 'og:url', content: 'https://macro.berezini.com/app-seasonality'},
      {property: 'og:type', content: 'website'},
      {property: 'og:image', content: 'https://macro.berezini.com/assets/images/seasonality-analysis-og-image.png'}, // Replace with your actual image path
    ]);
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

    this.cdRef.detectChanges();
  }
}
