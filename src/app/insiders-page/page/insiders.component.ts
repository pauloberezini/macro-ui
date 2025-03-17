import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {StockDataService} from '../../services/stock-data.service';
import {InsiderData} from '../../model/InsiderData';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {TradingViewChartComponent} from "../chart/trading-view-chart.component";
import {CamelCasePipe} from "../../model/truncate-pipe";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FundamentalDataComponent} from "../fundamental-data/fundamental-data.component";
import {CompanyProfileComponent} from "../company-profile/company-profile.component";
import {StockSuggestion} from "../../model/stock-suggestion";

@Component({
  selector: 'insiders',
  templateUrl: './insiders.component.html',
  styleUrls: ['./insiders.component.css'],
  imports: [
    SearchBarComponent,
    MatToolbarModule,
    TradingViewChartComponent,
    MatTableModule,
    CamelCasePipe,
    TitleCasePipe,
    MatProgressSpinnerModule,
    FundamentalDataComponent,
    CompanyProfileComponent,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class InsidersComponent implements AfterViewInit {

  public data = new MatTableDataSource<InsiderData>([]);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  selectedSuggestion: string = '';
  isLoading = false; // Prevents duplicate API calls

  displayedColumns: string[] = [
    'title',
    'symbol',
    'filingDate',
    'transactionDate',
    'transactionCode',
    'amount',
    'sharesHeld',
    'price',
    'ownership',
    'relationship'
  ];

  constructor(private stockDataService: StockDataService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.sort) this.data.sort = this.sort;
      if (this.paginator) this.data.paginator = this.paginator;
    });
  }

  handleSuggestion(suggestion: StockSuggestion): void {
    if (suggestion.ticker !== this.selectedSuggestion) {
      this.selectedSuggestion = suggestion.ticker;
      this.getInsidersData();
    }
  }

  getInsidersData(): void {
    if (!this.selectedSuggestion || this.isLoading) return;

    this.isLoading = true;
    this.data.data = []; // Clear previous data

    this.stockDataService.getInsidersDataForStock(this.selectedSuggestion).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.length > 0) {
          this.data.data = response.sort((a, b) =>
            new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
          );
        } else {
          console.warn('No data received for symbol:', this.selectedSuggestion);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching insider data:', error);
      },
    });
  }
}
