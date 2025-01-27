import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {InsiderData} from '../../model/InsiderData';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'insiders',
  templateUrl: './insiders.component.html',
  styleUrls: ['./insiders.component.css'],
})
export class InsidersComponent implements AfterViewInit {

  public data = new MatTableDataSource<InsiderData>([]);

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngAfterViewInit(): void {
    this.data.sort = this.sort;
  }

  selectedSuggestion: string = '';

  handleSuggestion(suggestion: string): void {
    this.selectedSuggestion = suggestion; // Handle the selected suggestion
    this.getInsidersData(); // Get the insiders data
  }

  displayedColumns: string[] = [
    'title',
    'symbol',
    'filingDate',
    'reportingName',
    'transactionDate',
    'transactionCode',
    'amount',
    'sharesHeld',
    'price',
    'ownership',
    'relationship'
  ];

  constructor(
    private stockDataService: StockDataService,
  ) {
  }

  getInsidersData(): void {
    this.data.data = []; // Clear the existing data

    this.stockDataService.getInsidersDataForStock(this.selectedSuggestion).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.data.data = response;
        } else {
          console.warn('No data received for symbol:', this.selectedSuggestion);
        }
      },
      error: (error) => {
        console.error('Error fetching insider data:', error);
      },
    });
  }

}
