import {Component} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {FormControl} from "@angular/forms";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-news-collection',
  templateUrl: './news-collection.component.html',
  styleUrls: ['./news-collection.component.css']
})
export class NewsCollectionComponent {
  private refreshClick = new Subject();
  private destroy$ = new Subject();
  canRefresh = true;

  newsCollection!: any[];
  selectedOption:string = '1';
  toppings = new FormControl('');
  currencies: string[] = ['USD', 'NZD', 'GBP', 'IDR', 'HKD', 'EUR', 'BRL', 'CAD', 'CNY', 'AUD', 'JPY', 'CHF', 'MXN', 'KRW', 'ZAR', 'NOK', 'SGD', 'INR'];
  selectedCountry: string[] = ['USD'];


  volatilities: string[] = ['🔥','🔥🔥','🔥🔥🔥'];
  volatility: string[] = ['🔥🔥🔥'];

  selectedRow: any;

  constructor(private stockDataService: StockDataService) {
  }

  ngOnInit(): void {
    this.refreshData();
    this.refreshClick.pipe(
      takeUntil(this.destroy$) // assuming you have a Subject to complete on destroy
    ).subscribe(() => {
      this.canRefresh = false;
      timer(6000).subscribe(() => {
        this.canRefresh = true;
      });
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

  refreshData(): void {
    if (this.canRefresh) {
      this.stockDataService.getHighNews().subscribe((data: any) => {
        this.newsCollection = data;
      });
      // @ts-ignore
      this.refreshClick.next();
    }
  }

}
