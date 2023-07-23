import {Component} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-news-collection',
  templateUrl: './news-collection.component.html',
  styleUrls: ['./news-collection.component.css']
})
export class NewsCollectionComponent {
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
    debugger
    this.stockDataService.getHighNews().subscribe((data: any) => {
      this.newsCollection = data;
    });
  }

}
