import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData } from '../model/stock-data';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private baseUrl = 'https://server.berezini.com/historical-data';

  constructor(private http: HttpClient) { }

  getStockData(symbol: string, fromYear: number, toYear: number): Observable<StockData[]> {
    const url = `${this.baseUrl}/${symbol}/${fromYear}/${toYear}`;
    return this.http.get<StockData[]>(url);
  }
}
