import { Component } from '@angular/core';
import { StockDataService } from '../services/stock-data.service';

@Component({
  selector: 'app-news-collection',
  templateUrl: './news-collection.component.html',
  styleUrls: ['./news-collection.component.css']
})
export class NewsCollectionComponent {
  newsCollection!: any[];

  ngOnInit(): void { 

     this.stockDataService.getHighNews().subscribe((data: any) => {
      this.newsCollection = data;
    });
  }
  
  
  constructor(private stockDataService: StockDataService) { }
}
