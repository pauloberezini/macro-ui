import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {StockDataService} from "../../services/stock-data.service";
import {InsiderData} from '../../model/InsiderData';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {FundamentalDataComponent} from "../fundamental-data/fundamental-data.component";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {TradingViewChartComponent} from "../chart/trading-view-chart.component";
import {CamelCasePipe} from "../../model/truncate-pipe";
import {TitleCasePipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CompanyProfileComponent} from "../company-profile/company-profile.component";

@Component({
  selector: 'insiders',
  templateUrl: './insiders.component.html',
  styleUrls: ['./insiders.component.css'],
  imports: [
    FundamentalDataComponent,
    SearchBarComponent,
    MatToolbarModule,
    TradingViewChartComponent,
    MatTableModule,
    CamelCasePipe,
    TitleCasePipe,
    MatProgressSpinnerModule,
    CompanyProfileComponent
  ],
  standalone: true
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
    // 'reportingName', no data from API
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
          // Sort the data by transactionDate in descending order
          const sortedData = response.sort((a, b) => {
            return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
          });
          this.data.data = sortedData;
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
