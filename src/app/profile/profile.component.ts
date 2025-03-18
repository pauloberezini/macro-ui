import {Component, OnInit} from '@angular/core';
import {FavoriteStock, StockSuggestion} from "../model/stock-suggestion";
import {Router} from "@angular/router";
import {UserFavoritesService} from "../services/user.favorites.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {SearchBarComponent} from "../insiders-page/search-bar/search-bar.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatIcon,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    SearchBarComponent,
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  favoriteStocks: FavoriteStock[] = [];

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
