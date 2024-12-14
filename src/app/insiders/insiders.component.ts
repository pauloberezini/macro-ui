import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {StockDataService} from "../services/stock-data.service";
import {InsiderData} from '../model/InsiderData';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'insiders',
  templateUrl: './insiders.component.html',
  styleUrls: ['./insiders.component.css'],
})
export class InsidersComponent implements AfterViewInit {

  public data = new MatTableDataSource<InsiderData>([]);

  @ViewChild(MatSort,{ static: true }) sort: MatSort;

  selectedSuggestion: string = '';

  handleSuggestion(suggestion: string): void {
    this.selectedSuggestion = suggestion; // Handle the selected suggestion
    this.getInsidersData(); // Get the insiders data
  }

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

  ngAfterViewInit(): void {
    if (this.sort) {
      this.data.sort = this.sort;
    } else {
      console.error("MatSort not initialized.");
    }
  }

  getInsidersData(): void {
    this.data.data = [];
    this.stockDataService.getInsidersDataForStock(this.selectedSuggestion).subscribe((response) => {
      this.data.data = response;
    });
  }
}
