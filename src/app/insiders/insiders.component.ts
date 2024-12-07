import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StockDataService} from "../services/stock-data.service";
import {InsiderData} from '../model/InsiderData';
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'insiders',
  templateUrl: './insiders.component.html',
  styleUrls: ['./insiders.component.css'],
})
export class InsidersComponent implements OnInit, AfterViewInit {

  public stockName: string;
  public data = new MatTableDataSource<InsiderData>([]);

  @ViewChild(MatSort,{ static: true }) sort: MatSort;

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

  ngAfterViewInit(): void {
    if (this.sort) {
      this.data.sort = this.sort;
    } else {
      console.error("MatSort not initialized.");
    }
  }

  announceSortChange(sortState: Sort) {
    console.log(sortState);
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
    });
  }
}
