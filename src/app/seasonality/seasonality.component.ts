import {ChangeDetectorRef, Component, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {SeasonalityPro} from "../yahoo-monthly-data/seasonality-pro.component";
import {PieAreaComponent} from "../pie-area/pie-area.component";
import {ChartYearComponentComponent} from "../chart-year-component/chart-year-component.component";
import {Meta} from "@angular/platform-browser";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-seasonality',
  templateUrl: './seasonality.component.html',
  styleUrls: ['./seasonality.component.css']
})

export class SeasonalityComponent implements OnInit {
  @ViewChild(SeasonalityPro) lineChartComponent!: SeasonalityPro;
  @ViewChild(PieAreaComponent) pieAreaComponent!: PieAreaComponent;
  @ViewChild(ChartYearComponentComponent) chartYearComponentComponent!: ChartYearComponentComponent;
  @ViewChild('dynamicInsert', {read: ViewContainerRef}) dynamicInsert: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  gridCols: number;
  grid = {cols: 5, rowHeight: '2:1'};
  tiles: Tile[] = [
    {cols: 3, rows: 3, color: 'lightblue'}, // 70% of the grid
    {cols: 1, rows: 3, color: 'lightgreen'}, // 30% of the grid
    // {cols: 2, rows: 1, color: 'lightpink'}, // Full width
  ];

  constructor(private metaTagService: Meta, private breakpointObserver: BreakpointObserver,
              private cdRef: ChangeDetectorRef) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.grid.cols = 3;
          this.grid.rowHeight = '1.75:1';
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.grid.cols = 3;
          this.grid.rowHeight = '1.5:1';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.grid.cols = 3;
          this.grid.rowHeight = '1.75:1';
        } else {
          this.grid.cols = 4;
          this.grid.rowHeight = '2:1';
        }
        console.log('grid.cols: ', this.grid.cols)
        console.log('grid.rowHeight: ', this.grid.rowHeight)

      }
    });
  }

  hidePie: boolean = true;
  selectedStockSymbol: string = 'SP500';
  election: string = 'elec';
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

  async getData() {
    this.dynamicInsert.clear();
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

    const componentMap = {
      'GAS': () => import('../dynamic-component/gas/gas.component').then(m => m.GasComponent),
      // Add other mappings...
    };

    if (componentMap[this.selectedStockSymbol]) {
      const componentFactory = await componentMap[this.selectedStockSymbol]().then((cmp: Type<unknown>) => {
        return this.dynamicInsert.createComponent(cmp);
      });
      this.componentRef = componentFactory;
      // Optionally set properties on the component instance
      // this.componentRef.instance.someInput = someValue;
    }
  }
}
