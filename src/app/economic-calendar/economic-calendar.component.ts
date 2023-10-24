import {Component, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {FormControl} from "@angular/forms";
import {Subject} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from "@angular/material/table";
import {EventDto} from "../model/event-dto";
import {VolatilityPipe} from "../model/volatility.pipe";


@Component({
  selector: 'app-economic-calendar',
  templateUrl: './economic-calendar.component.html',
  styleUrls: ['./economic-calendar.component.css']
})
export class EconomicCalendarComponent implements OnInit{
  private refreshClick = new Subject();
  private destroy$ = new Subject();
  allNews: EventDto[];

  canRefresh = true;

  newsCollection: MatTableDataSource<EventDto>;
  selectedOption: string = '2';
  toppings = new FormControl('');
  currencies: string[] = ['USD', 'NZD', 'GBP', 'IDR', 'HKD', 'EUR', 'BRL', 'CAD', 'CNY', 'AUD', 'JPY', 'CHF', 'MXN', 'KRW', 'ZAR', 'NOK', 'SGD', 'INR'];
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


  filterData(): void {
    let filteredNews = this.allNews.filter(event =>
      this.selectedCountry.includes(event.country) &&
      this.volatility.includes(event.volatility)
    );

    if(filteredNews.length == 0){
      return;
    }else {
      this.newsCollection = new MatTableDataSource<EventDto>(filteredNews);
    }
    this.newsCollection.sort = this.empTbSort;
  }

  onRadioButtonClick(index:number){
    if(index == 1){
      this.newsCollection = new MatTableDataSource<EventDto>(this.allNews);
    }
  }
}
