import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { StockSuggestion } from "../model/stock-suggestion";

@Injectable({
  providedIn: 'root'
})
export class UserFavoritesService {
  private baseUrl = `${environment.url}/api/users`;

  constructor(private http: HttpClient) {}

  /** 🔹 Get user's favorite stocks */
  getUserFavoriteStocks(): Observable<StockSuggestion[]> {
    const url = `${this.baseUrl}/${localStorage.getItem('userId')}/stocks`;
    return this.http.get<StockSuggestion[]>(url);
  }

  /** 🔹 Add a stock to user's favorites */
  addUserFavoriteStock(stock: StockSuggestion): Observable<StockSuggestion> {
    const url = `${this.baseUrl}/${localStorage.getItem('userId')}/stocks`;
    return this.http.post<StockSuggestion>(url, stock);
  }

  /** 🔹 Remove a stock from user's favorites */
  removeUserFavoriteStock(favoriteStock: StockSuggestion ): Observable<any> {
    const url = `${this.baseUrl}/${localStorage.getItem('userId')}/stocks/${favoriteStock.id}`;
    return this.http.delete<any>(url);
  }
}
