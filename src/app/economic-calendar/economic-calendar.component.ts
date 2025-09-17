import {AfterViewInit, Component, OnInit, ViewChild, HostListener, signal} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {FormControl, FormsModule} from "@angular/forms";
import {Subject} from 'rxjs';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {EventDto} from "../model/event-dto";
import {VolatilityPipe} from "../model/volatility.pipe";
import {EconomicDataComponent} from "../macro-chart/economic-data.component";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {TimeFormatPipe} from "../model/time-format.pipe";
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf, NgStyle, DatePipe} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";


@Component({
  selector: 'app-economic-calendar',
  templateUrl: './economic-calendar.component.html',
  standalone: true,
  imports: [
    EconomicDataComponent,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    TimeFormatPipe,
    MatSortModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    NgForOf,
    NgIf,
    NgStyle,
    NgClass,
    DatePipe,
  ],
  styleUrls: ['./economic-calendar.component.css']
})
export class EconomicCalendarComponent implements OnInit, AfterViewInit {
  private refreshClick = new Subject();
  private destroy$ = new Subject();
  
  // Data properties
  allNews: EventDto[];
  newsCollection: MatTableDataSource<EventDto>;
  selectedRow: any;
  
  // UI State properties
  isLoading: boolean = false;
  hasError: boolean = false;
  lastUpdated: Date = new Date();
  canRefresh = true;
  
  // Mobile detection
  isMobileView = signal(false);

  // Filter properties
  selectedOption: string = '2';
  toppings = new FormControl('');
  currencies: string[] = ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'CHF', 'NZD', 'CNY', 'IDR', 'HKD', 'BRL', 'MXN', 'KRW', 'ZAR', 'NOK', 'SGD', 'INR'];
  selectedCountry: string[] = ['USD'];
  volatilisesSymbolic: string[] = ['🔥', '🔥🔥', '🔥🔥🔥'];
  volatilises: string[] = ['*', '**', '***'];
  volatility: string[] = ['***'];

  @ViewChild(MatSort) empTbSort!: MatSort;

  constructor(private stockDataService: StockDataService) {
    this.newsCollection = new MatTableDataSource<EventDto>([]);
  }

  ngOnInit(): void {
    this.loadData();
    let volatilityPipe = new VolatilityPipe();
    this.volatilisesSymbolic = this.volatilises.map(volatility => volatilityPipe.transform(volatility));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.newsCollection) {
        this.newsCollection.sort = this.empTbSort;
        console.log("Sorting Applied:", this.empTbSort);
      }
    });
  }

  onMouseOver(row: any) {
    row.isHovered = true;
  }

  onMouseLeave(row: any) {
    row.isHovered = false;
  }

  onMacroNewsClick(row: any) {
    this.selectedRow = row;
  }

  loadData(): void {
    if (this.canRefresh && !this.isLoading) {
      this.isLoading = true;
      this.hasError = false;
      
      this.stockDataService.getHighNews().subscribe({
        next: (data: EventDto[]) => {
          console.log("Raw API Data:", data);

          const volatilityMapping: Record<string, string> = {
            '*': '*',
            '**': '**',
            '***': '***'
          };

          this.allNews = data.map(event => ({
            ...event,
            volatility: volatilityMapping[event.volatility?.trim()] || '*',
          }));

          console.log("Processed Data:", this.allNews);

          this.newsCollection = new MatTableDataSource<EventDto>(this.allNews);

          setTimeout(() => {
            if (this.empTbSort) {
              this.newsCollection.sort = this.empTbSort;
            }
          });

          this.filterData();
          this.lastUpdated = new Date();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      });

      this.refreshClick.next(1);
    }
  }

  /**
   * Clear all active filters and show all data
   */
  clearFilters(): void {
    this.selectedCountry = [...this.currencies];
    this.volatility = [...this.volatilises];
    this.filterData();
  }

  getBackgroundColor(actualInfo: string, forecastInfo: string): string {
    const actual = parseFloat(actualInfo.trim());
    const forecast = parseFloat(forecastInfo.trim());

    if (!isNaN(actual) && !isNaN(forecast)) {
      if (actual > forecast) {
        return '#ccffcc'; // Light green for actual greater than forecast
      } else if (actual < forecast) {
        return '#ffcccc'; // Light red for actual less than forecast
      }
    }
    return 'transparent'; // Default no background
  }

  filterData(): void {
    this.selectedRow = null;

    console.log("Filtering Data with:", this.selectedCountry, this.volatility);

    const availableCountries = [...new Set(this.allNews.map(e => e.country))];
    const availableVolatility = [...new Set(this.allNews.map(e => e.volatility))];

    console.log("Available Country Values:", availableCountries);
    console.log("Available Volatility Values:", availableVolatility);

    const validCountries = this.selectedCountry.filter(c => availableCountries.includes(c));
    const validVolatility = this.volatility.filter(v => availableVolatility.includes(v));

    if (validCountries.length === 0) {
      console.warn("Selected countries do not match available values. Using all available.");
      validCountries.push(...availableCountries);
    }
    if (validVolatility.length === 0) {
      console.warn("Selected volatility values do not match available values. Using all available.");
      validVolatility.push(...availableVolatility);
    }

    let filteredNews = this.allNews.filter(event =>
      validCountries.includes(event.country) &&
      validVolatility.includes(event.volatility)
    );

    console.log("Filtered Data:", filteredNews);

    this.newsCollection.data = filteredNews;

    if (this.newsCollection.sort) {
      this.newsCollection.sort = this.empTbSort;
    }
  }

  /**
   * Check if the event is happening today
   * @param eventTime - The time of the event
   * @returns true if the event is today, false otherwise
   */
  isEventToday(eventTime: string): boolean {
    if (!eventTime) return false;
    
    try {
      const today = new Date();
      const eventDate = new Date(eventTime);
      
      return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    } catch (error) {
      console.warn('Invalid date format:', eventTime);
      return false;
    }
  }
}
