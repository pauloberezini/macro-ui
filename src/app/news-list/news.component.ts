import { Component } from '@angular/core';
import { StockDataService } from '../services/stock-data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

  articles = [
    {
      title: 'News Title 1',
      description: 'News Description 1',
      publishedAt: 'Date',
      content: 'News Content 1',
      url: "https"
    }
  ];
  constructor(private stockDataService: StockDataService) { }

  ngOnInit(): void {

    this.stockDataService.getMarketNews().subscribe((data: any) => {
      this.articles = data;
    });
  }

}
