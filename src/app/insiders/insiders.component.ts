import {Component, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../services/stock-data.service";
import {InsiderData} from '../model/InsiderData';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'insiders',
  templateUrl: './insiders.component.html',
  styleUrls: ['./insiders.component.css']
})
export class InsidersComponent implements OnInit {

  public stockName: string;
  public data = new MatTableDataSource<InsiderData>([]);

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'title',
    'transactionDate',
    'transactionCode',
    'amount',
    'price',
    'sharesHeld',
    'ownership',
    'relationship',
  ];

  constructor(
    private stockDataService: StockDataService,
  ) {}

  ngOnInit() {
    this.stockName = this.stockSymbols[0];
    this.getInsidersData();
  }

  stockSymbols = [
    "OPEN",
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOGL",
    "META",
    "TSLA",
    "NVDA",
    "BRK-A",
    "JNJ",
    "JPM"
  ];

  onSelectedStockChanges(): void {
    this.getInsidersData();
  }

  getInsidersData(): void {
    this.data.data = [];
    this.stockDataService.getInsidersDataForStock(this.stockName).subscribe((response) => {
      this.data.data = response;
      this.data.sort = this.sort;
    });
  }
}
