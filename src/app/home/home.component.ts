import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {Router} from "@angular/router";
import {UserFavoritesService} from '../services/user.favorites.service';
import {NgForOf, NgIf} from "@angular/common";
import {SearchBarComponent} from "../insiders-page/search-bar/search-bar.component";
import {FavoriteStock, StockSuggestion} from "../model/stock-suggestion";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    NgForOf,
    NgIf,
    SearchBarComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  favoriteStocks: FavoriteStock[] = [];

  constructor(private router: Router, private userFavoritesService: UserFavoritesService) {}

  addFavoriteStock(suggestion: StockSuggestion): void {
    this.userFavoritesService.addUserFavoriteStock(suggestion)
        .subscribe((stock) => this.loadFavoriteStocks());
  }

  removeFavoriteStock(stock: FavoriteStock): void {
    this.userFavoritesService.removeUserFavoriteStock(stock)
        .subscribe(() => this.favoriteStocks = this.favoriteStocks.filter(s => s !== stock));
  }

  testimonials = [
    {
      text: 'The most comprehensive macroeconomic analysis platform we\'ve used...',
      name: 'Sarah Johnson',
      position: 'Chief Economist, Global Bank',
      photo: 'assets/team/sarah.jpg'
    },
    {
      text: 'Revolutionized our research capabilities overnight',
      name: 'Michael Chen',
      position: 'Portfolio Manager, Hedge Fund',
      photo: 'assets/team/michael.jpg'
    }
  ];


  currentStats = {
    countries: 57,
    indicators: 2340,
    updatesDaily: 1200000
  };

  marketingData = {
    users: 500000,
    revenue: 12000000,
    growthRate: 35
  };

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

  goToLegal() {
    this.router.navigate(['/legal']);
  }

  goToAboutUs() {
    this.router.navigate(['/app-supported-by']);
  }

  goToTerms() {
    this.router.navigate(['/terms']);
  }

  goToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }
}
