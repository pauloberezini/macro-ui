import {Component} from '@angular/core';
import {StockDataService} from '../services/stock-data.service';


@Component({
  selector: 'app-news-collection',
  templateUrl: './news-collection.component.html',
  styleUrls: ['./news-collection.component.css']
})
export class NewsCollectionComponent {
  newsCollection!: any[];
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
    this.stockDataService.getHighNews().subscribe((data: any) => {
      this.newsCollection = data;
    });
  }

}
