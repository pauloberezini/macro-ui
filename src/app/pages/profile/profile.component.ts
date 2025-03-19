import {Component, OnInit} from '@angular/core';
import {FavoriteStock, StockSuggestion} from "../../model/stock-suggestion";
import {Router} from "@angular/router";
import {UserFavoritesService} from "../../services/user.favorites.service";
import {MatCard} from "@angular/material/card";
import {SearchBarComponent} from "../../insiders-page/search-bar/search-bar.component";
import {NgForOf, TitleCasePipe} from "@angular/common";
import {CamelCasePipe} from "../../model/truncate-pipe";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-profile',
  imports: [
    MatCard,
    SearchBarComponent,
    NgForOf,
    CamelCasePipe,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    TitleCasePipe,
    MatColumnDef,
    MatHeaderCellDef,
    MatSort,
    MatCard
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  favoriteStocks: FavoriteStock[] = [];

  public get tableStocks() {
    return this.favoriteStocks.map((f)=> f.stockCik);
  }

  displayedColumns: string[] = [
    'title',
    'ticker'
  ];

  constructor(private router: Router, private userFavoritesService: UserFavoritesService) {
  }


  ngOnInit(): void {
    this.loadFavoriteStocks();
  }

  loadFavoriteStocks(): void {
    this.userFavoritesService.getUserFavoriteStocks().subscribe(
      (stocks) => {
        console.log(stocks);
        this.favoriteStocks = stocks;
      }
    );
  }

  addFavoriteStock(suggestion: StockSuggestion): void {
    this.userFavoritesService.addUserFavoriteStock(suggestion)
      .subscribe((stock) => this.loadFavoriteStocks());
  }

  removeFavoriteStock(stock: FavoriteStock): void {
    this.userFavoritesService.removeUserFavoriteStock(stock)
      .subscribe(() => this.favoriteStocks = this.favoriteStocks.filter(s => s !== stock));
  }
}
