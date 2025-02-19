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
  standalone: true,
  imports: [
    ChartYearComponentComponent
  ],
  styleUrls: ['./seasonality.component.css']
})

export class SeasonalityComponent implements OnInit {
  @ViewChild(SeasonalityPro) lineChartComponent!: SeasonalityPro;
  @ViewChild(PieAreaComponent) pieAreaComponent!: PieAreaComponent;
  @ViewChild(ChartYearComponentComponent) chartYearComponentComponent!: ChartYearComponentComponent;
  @ViewChild('dynamicInsert', {read: ViewContainerRef}) dynamicInsert!: ViewContainerRef;


  constructor(private metaTagService: Meta, private cdRef: ChangeDetectorRef) {

  }
  selectedStockSymbol: string = 'SP500';
  selectedMonth: string = '04';

  async ngOnInit() {
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

  handleValueChanged(stockName: string) {
    this.selectedStockSymbol = stockName;
    this.getData();
  }

  async getData(){
    debugger
    if (this.dynamicInsert) {
      this.dynamicInsert.clear();
    }

    this.cdRef.detectChanges();

    const componentMap: Record<string, () => Promise<Type<any>>> = {
      'GAS': () => import('../dynamic-component/gas/gas.component').then(m => m.GasComponent),
      // Add other mappings...
    };

    if (componentMap[this.selectedStockSymbol]) {
      await componentMap[this.selectedStockSymbol]().then((cmp: Type<unknown>) => {
        return this.dynamicInsert.createComponent(cmp);
      });
    }
  }

}
