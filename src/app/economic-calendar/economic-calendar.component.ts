import {Component, OnInit, ViewChild} from '@angular/core';
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
import {NgForOf, NgStyle} from "@angular/common";
import {ExtendedModule} from "@angular/flex-layout";
import {MatToolbarModule} from "@angular/material/toolbar";


@Component({
  selector: 'app-economic-calendar',
  templateUrl: './economic-calendar.component.html',
  standalone: true,
  imports: [
    EconomicDataComponent,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    TimeFormatPipe,
    MatSortModule,
    MatIconModule,
    NgStyle,
    ExtendedModule,
    MatToolbarModule,
    NgForOf
  ],
  styleUrls: ['./economic-calendar.component.css']
})
export class EconomicCalendarComponent implements OnInit {
  private refreshClick = new Subject();
  private destroy$ = new Subject();
  allNews: EventDto[];

  canRefresh = true;

  newsCollection: MatTableDataSource<EventDto>;
  selectedOption: string = '2';
  toppings = new FormControl('');
  currencies: string[] = ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'CHF', 'NZD', 'CNY', 'IDR', 'HKD', 'BRL', 'MXN', 'KRW', 'ZAR', 'NOK', 'SGD', 'INR'];
  selectedCountry: string[] = ['USD'];


  volatilisesSymbolic: string[] = ['🔥', '🔥🔥', '🔥🔥🔥'];
  volatilises: string[] = ['*', '**', '***'];
  volatility: string[] = ['***'];

  selectedRow: any;
  @ViewChild('empTbSort') empTbSort = new MatSort();

  constructor(private stockDataService: StockDataService) {
  }

  ngOnInit(): void {
    this.loadData();
    let volatilityPipe = new VolatilityPipe();
    this.volatilisesSymbolic = this.volatilises.map(volatility => volatilityPipe.transform(volatility));
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
    if (this.canRefresh) {
      this.stockDataService.getHighNews().subscribe((data: EventDto[]) => {
        this.allNews = data;
        this.newsCollection = new MatTableDataSource<EventDto>(data);
        this.newsCollection.sort = this.empTbSort;
        this.filterData();
      });
      // @ts-ignore
      this.refreshClick.next();
    }
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
    let filteredNews = this.allNews.filter(event =>
      this.selectedCountry.includes(event.country) &&
      this.volatility.includes(event.volatility)
    );

    if (filteredNews.length == 0) {
      return;
    } else {
      this.newsCollection = new MatTableDataSource<EventDto>(filteredNews);
    }
    this.newsCollection.sort = this.empTbSort;
  }

  onRadioButtonClick(index: number) {
    if (index == 1) {
      this.newsCollection = new MatTableDataSource<EventDto>(this.allNews);
    }
  }
}
