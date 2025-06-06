import {Component, EventEmitter, HostListener, OnInit, Output, Type} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {StockDataService} from "../services/stock-data.service";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import annotationPlugin from "chartjs-plugin-annotation";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInput} from "@angular/material/input";
import {SearchBarComponent} from "../insiders-page/search-bar/search-bar.component";
import {StockSuggestion} from "../model/stock-suggestion";
import {MatTableDataSource} from "@angular/material/table";
import {InsiderData} from "../model/InsiderData";
import {LoaderComponent} from "../loader/loader.component";
import {NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-chart-year-component',
  templateUrl: './chart-year-component.component.html',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
    SearchBarComponent,
    LoaderComponent,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./chart-year-component.component.css']
})
export class ChartYearComponentComponent implements OnInit {
  @Output() valueChanged = new EventEmitter<string>();
  public data = new MatTableDataSource<InsiderData>([]);
  isLoading = false; // Prevents duplicate API calls

  public chart: any;
  public chartSeasonal: any;
  canvasId: string;
  canvasIdSeasonal: string;
  resizeEvent = new Subject<void>();

  public election: string = 'regular';
  public stockName: string = 'SP500';
  clearOnDropdown: boolean = false;

  stockSymbols: string[] = [
    "AUDUSD", "BRENT", "BTCUSD", "COPPER", "CORN", "DAX",
    "DOW_JONES", "DXY", "EURUSD", "GAS", "GASOLINE", "GBPUSD",
    "GOLD", "NASDAQ_100", "NIKKEI_225", "NZDUSD", "PLATINUM",
    "SILVER", "SOYBEANS", "SP500", "USDCAD", "USDCHF", "USDJPY",
    "WHEAT", "WTI"
  ];

  getMarketstackSymbol(symbol: string): string {
    const symbolMapMarket: Record<string, string> = {
      AUDUSD: "FXA",
      BRENT: "BNO",
      BTCUSD: "GBTC",
      COPPER: "CPER",
      CORN: "CORN",
      DAX: "DAX",
      DOW_JONES: "DIA",
      DXY: "UUP",
      EURUSD: "FXE",
      GAS: "UNG",
      GASOLINE: "UGA",
      GBPUSD: "FXB",
      GOLD: "GLD",
      NASDAQ_100: "QQQ",
      NIKKEI_225: "EWJ",
      NZDUSD: "BNZ",
      PLATINUM: "PPLT",
      SILVER: "SLV",
      SOYBEANS: "SOYB",
      SP500: "SPY",
      USDCAD: "FXC",
      USDCHF: "FXF",
      USDJPY: "FXY",
      WHEAT: "WEAT",
      WTI: "USO",
    };
    return symbolMapMarket[symbol] || symbol;
  }


  values: number[] = [];
  selectedSuggestion: string;

  constructor(public stockDataService: StockDataService) {
    this.resizeEvent.pipe(
      debounceTime(300) // Wait for 300ms pause in events to avoid thrashing
    ).subscribe(() => {
      this.createSeasonalChart(null);
    });
  }

  ngOnInit(): void {
    this.canvasId = 'chart-year-component-' + Math.random().toString(36).substring(2, 15);
    this.canvasIdSeasonal = 'chart-year-component-seasonal-' + Math.random().toString(36).substring(2, 15);
    this.createSeasonalChart('dropdown');
  }

  async getData(source: string) {
    if (source === 'dropdown') {
      this.clearOnDropdown = true; // Set flag to clear the input in SearchBar component
    } else {
      this.clearOnDropdown = false; // No clearing needed for other sources
    }
    this.createSeasonalChart(source);
    this.valueChanged.emit(this.stockName);
  }

  handleSuggestion(suggestion: StockSuggestion): void {
    if (suggestion.ticker !== this.selectedSuggestion) {
      this.selectedSuggestion = suggestion.ticker;
      this.createSeasonalChart(null);
    }
  }


  ngOnDestroy() {
    this.resizeEvent.unsubscribe();
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeEvent.next();
  }

  generateDailyLabels(year: number) {
    const dailyLabels = [];
    for (let month = 0; month < 12; month++) {
      let date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        dailyLabels.push(
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0')
        );
        date.setDate(date.getDate() + 1);
      }
    }
    return dailyLabels;
  }

  createSeasonalChart(source: string) {
    let marketstackSymbol: string = this.getTicker(source);
    console.log('Selected marketstack symbol:', marketstackSymbol);
    if (!marketstackSymbol) {
      return;
    }


    this.stockDataService.getSeasonalData(marketstackSymbol, this.election).subscribe((seasonalResponse: any) => {
      const seasonalData = seasonalResponse.data;
      // Sort by date
      seasonalData.sort((a: { date: string | number | Date; }, b: {
        date: string | number | Date;
      }) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const seasonalDataFormatted = seasonalData.map((item: { date: string; value: any; }) => ({
        x: '2023' + item.date.slice(4, 10), // '2023-MM-DD'
        y: item.value
      }));

      const seasonalLabel = marketstackSymbol + ' 15 years regular';

      this.stockDataService.getCurrentYearData(marketstackSymbol).subscribe((actualResponse: any) => {
        const actualData = actualResponse.data;
        // Sort by date
        actualData.sort((a: { date: string | number | Date; }, b: {
          date: string | number | Date;
        }) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Normalize
        const actualStart = actualData[0]?.value || 0;
        const actualNormalized = actualData.map((item: { date: string; value: number; }) => ({
          x: '2023' + item.date.slice(4, 10),
          y: item.value - actualStart
        }));

        if (this.chartSeasonal) {
          this.chartSeasonal.destroy();
        }
        Chart.register(annotationPlugin);

        this.chartSeasonal = new Chart(this.canvasIdSeasonal, {
          type: 'line',
          data: {
            datasets: [
              {
                label: seasonalLabel,
                data: seasonalDataFormatted,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1,
                pointBackgroundColor: 'rgb(54, 162, 235)',
                tension: 0.4,
                pointStyle: false,
                fill: false
              },
              {
                label: marketstackSymbol + ' Actual ' + (new Date().getFullYear()),
                data: actualNormalized,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(255, 99, 132)',
                tension: 0.4,
                pointStyle: false,
                fill: false
              }
            ]
          },
          options: {
            aspectRatio: 2.5,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'month',
                  displayFormats: {month: 'MMM'}
                },
                grid: {color: 'rgba(0, 0, 0, 0.1)'},
                ticks: {autoSkip: true, maxTicksLimit: 12}
              },
              y: {
                grid: {color: 'rgba(0, 0, 0, 0.1)'}
              }
            },
            plugins: {
              legend: {labels: {font: {size: 14}}}
            }
          }
        });
      });
    });
  }

  getTicker(source: string) {
    if (source === 'dropdown') {
      this.selectedSuggestion = this.getMarketstackSymbol(this.stockName);
    }
    if (this.selectedSuggestion && this.selectedSuggestion.length > 0) {
      return this.selectedSuggestion;
    } else {
      return this.getMarketstackSymbol(this.stockName);
    }
  }
}
