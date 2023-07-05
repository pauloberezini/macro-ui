import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../services/stock-data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

  articles: any = null;
  constructor(private stockDataService: StockDataService) { }

  ngOnInit(): void {
    this.stockDataService.getMarketNews().subscribe((data: any) => {
      this.articles = data;
    });
  }

}
