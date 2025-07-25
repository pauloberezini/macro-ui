import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {Chart} from 'chart.js/auto';
import {StockDataService} from "../services/stock-data.service";
import {Subject, BehaviorSubject, forkJoin} from "rxjs";
import {debounceTime, catchError, finalize} from "rxjs/operators";
import annotationPlugin from "chartjs-plugin-annotation";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SearchBarComponent} from "../insiders-page/search-bar/search-bar.component";
import {StockSuggestion} from "../model/stock-suggestion";
import {LoaderComponent} from "../loader/loader.component";
import {NgForOf, NgIf, AsyncPipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

// Interfaces for the new seasonal data response structure
interface SeasonalDataResponse {
  seasonalData: SeasonalDataDto[];
  metadata: SeasonalCalculationMetadata;
}

interface SeasonalCalculationMetadata {
  yearsUsed: number;
  yearsIncluded: number[];
  minTradingDays: number;
  totalDataPoints: number;
  electionType: string;
  stockSymbol: string;
  yearsDropped: number[];
  calculationMethod: string;
}

interface SeasonalDataDto {
  id: number;
  date: string;
  name: string;
  value: number;
  election: string;
  windowSize: number;
}

@Component({
  selector: 'app-chart-year-component',
  templateUrl: './chart-year-component.component.html',
  styleUrls: ['./chart-year-component.component.css'],
  standalone: true,
  imports: [
    MatButtonToggleModule,
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
    SearchBarComponent,
    LoaderComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    MatIcon
  ]
})
export class ChartYearComponentComponent implements OnInit {
  @Output() valueChanged = new EventEmitter<string>();

  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();
  error: string | null = null;

  // Chart data
  public chart: any;
  public chartSeasonal: any;
  canvasId: string;
  canvasIdSeasonal: string;
  resizeEvent = new Subject<void>();

  // Seasonal data metadata
  public seasonalMetadata: SeasonalCalculationMetadata | null = null;
  public calculationInfo: string = '';

  // Form controls
  public election: string = 'regular';
  public stockName: string = 'SP500';
  clearOnDropdown: boolean = false;

  stockSymbols: string[] = [
    "AUDUSD", "BRENT", "COPPER", "CORN", "DAX",
    "DOW_JONES", "DXY", "EURUSD", "GAS", "GASOLINE", "GBPUSD",
    "GOLD", "NASDAQ_100", "NIKKEI_225", "NZDUSD", "PLATINUM",
    "SILVER", "SOYBEANS", "SP500", "USDCAD", "USDCHF", "USDJPY",
    "WHEAT", "WTI"
  ];

  constructor(private stockDataService: StockDataService) {
    Chart.register(annotationPlugin);
    this.resizeEvent.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.createSeasonalChart(null);
    });
  }

  ngOnInit(): void {
    this.canvasId = 'chart-year-component-' + Math.random().toString(36).substring(2, 15);
    this.canvasIdSeasonal = 'chart-year-component-seasonal-' + Math.random().toString(36).substring(2, 15);
    this.getData('init');
  }

  getMarketstackSymbol(symbol: string): string {
    const symbolMapMarket: Record<string, string> = {
      AUDUSD: "FXA", BRENT: "BNO",
      COPPER: "CPER", CORN: "CORN", DAX: "DAX",
      DOW_JONES: "DIA", DXY: "UUP", EURUSD: "FXE",
      GAS: "UNG", GASOLINE: "UGA", GBPUSD: "FXB",
      GOLD: "GLD", NASDAQ_100: "QQQ", NIKKEI_225: "EWJ",
      NZDUSD: "BNZ", PLATINUM: "PPLT", SILVER: "SLV",
      SOYBEANS: "SOYB", SP500: "SPY", USDCAD: "FXC",
      USDCHF: "FXF", USDJPY: "FXY", WHEAT: "WEAT",
      WTI: "USO",
    };
    return symbolMapMarket[symbol] || symbol;
  }

  getData(source: string) {
    if (source === 'dropdown') {
      this.clearOnDropdown = true;
    } else {
      this.clearOnDropdown = false;
    }
    this.createSeasonalChart(source);
    this.valueChanged.emit(this.stockName);
  }

  handleSuggestion(suggestion: StockSuggestion): void {
    // Extract clean ticker from suggestion
    const cleanTicker = this.extractCleanTicker(suggestion.ticker);

    if (cleanTicker !== this.stockName) {
      this.stockName = cleanTicker;
      this.valueChanged.emit(this.stockName);
      this.createSeasonalChart(null);
    }
  }

  // Helper method to extract clean ticker symbol
  private extractCleanTicker(ticker: string): string {
    if (!ticker) return '';

    // If ticker contains parentheses (like "NVDA (NVIDIA CORP)"), extract just the ticker part
    const match = ticker.match(/^([A-Z0-9._-]+)(?:\s*\(.*\))?$/);
    return match ? match[1] : ticker.trim();
  }

  ngOnDestroy() {
    this.resizeEvent.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeEvent.next();
  }

  private createSeasonalChart(source: string | null) {
    if (this.loadingSubject.value) return;

    this.loadingSubject.next(true);
    this.error = null;

    const marketstackSymbol = this.getMarketstackSymbol(this.stockName);
    if (!marketstackSymbol) {
      this.loadingSubject.next(false);
      return;
    }

    forkJoin({
      seasonal: this.stockDataService.getSeasonalData(marketstackSymbol, this.election),
      current: this.stockDataService.getCurrentYearData(marketstackSymbol)
    }).pipe(
      catchError(err => {
        console.error('Error fetching data:', err);
        this.error = 'Failed to load chart data. Please try again.';
        throw err;
      }),
      finalize(() => {
        setTimeout(() => {
          this.loadingSubject.next(false);
        }, 300);
      })
    ).subscribe({
      next: ({seasonal, current}) => {
        // Handle the new seasonal data response structure
        const seasonalData = this.processSeasonalData(seasonal.data.seasonalData);
        const actualData = this.processActualData(current.data);

        // Store metadata and create calculation info
        this.seasonalMetadata = seasonal.data.metadata;
        this.updateCalculationInfo();

        // Use requestAnimationFrame to ensure the DOM is updated
        requestAnimationFrame(() => {
          this.createChart(seasonalData, actualData, marketstackSymbol);
        });
      },
      error: (error) => {
        console.error('Error in chart creation:', error);
        this.error = 'Failed to create chart. Please try again.';
      }
    });
  }

  private updateCalculationInfo() {
    if (this.seasonalMetadata) {
      const { yearsUsed, yearsIncluded, yearsDropped, calculationMethod } = this.seasonalMetadata;

      // Keep calculationInfo for template binding, but we'll use getters for structured data
      this.calculationInfo = `${yearsUsed} years analyzed`;
    } else {
      this.calculationInfo = '';
    }
  }

  // Getters for template binding
  get yearsAnalyzed(): number {
    return this.seasonalMetadata?.yearsUsed || 0;
  }

  get includedYears(): number[] {
    return this.seasonalMetadata?.yearsIncluded || [];
  }

  get excludedYears(): number[] {
    return this.seasonalMetadata?.yearsDropped || [];
  }

  get algorithmName(): string {
    return this.seasonalMetadata?.calculationMethod?.replace('Bloomberg-style trading day index', 'Bloomberg Algorithm') || '';
  }

  get hasExcludedYears(): boolean {
    return this.excludedYears.length > 0;
  }

  private processSeasonalData(data: any[]) {
    return data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        x: '2023' + item.date.slice(4, 10),
        y: item.value
      }));
  }

  private processActualData(data: any[]) {
    const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const startValue = sorted[0]?.value || 0;

    return sorted.map(item => ({
      x: '2023' + item.date.slice(4, 10),
      y: item.value - startValue
    }));
  }

  private createChart(seasonalData: any[], actualData: any[], symbol: string) {
    const maxAttempts = 10;
    const attemptInterval = 100;
    let attempts = 0;

    const tryCreateChart = () => {
      const canvas = document.getElementById(this.canvasIdSeasonal) as HTMLCanvasElement;
      if (!canvas) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryCreateChart, attemptInterval);
        } else {
          console.error('Canvas element not found after maximum attempts');
          this.error = 'Failed to initialize chart. Please try again.';
        }
        return;
      }

      if (this.chartSeasonal) {
        this.chartSeasonal.destroy();
      }

      this.chartSeasonal = new Chart(canvas, {
        type: 'line',
        data: {
          datasets: [
            {
              label: `${symbol} Seasonal Data`,
              data: seasonalData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.4,
              borderWidth: 1,
              pointStyle: false,
              fill: false
            },
            {
              label: `${symbol} Current Year`,
              data: actualData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.4,
              borderWidth: 1,
              pointStyle: false,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM'
                }
              },
              title: {
                display: true,
                text: 'Month'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Change (%)'
              }
            }
          }
        }
      });
    };

    tryCreateChart();
  }
}
