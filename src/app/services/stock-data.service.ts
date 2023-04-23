import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData } from '../model/stock-data';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private baseUrl = 'http://localhost:8089/historical-data';
  private baseUrlAllDaily = 'http://localhost:8089/historical-data/daily/all';

  constructor(private http: HttpClient) { }

  getStockData(symbol: string, fromYear: number, toYear: number): Observable<StockData[]> {
    const url = `${this.baseUrl}/${symbol}/${fromYear}/${toYear}`;
    return this.http.get<StockData[]>(url);
  }

  
  getStockAllDailyData(symbol: string, monthNumber: string): Observable<StockData[]> {
    const url = `${this.baseUrlAllDaily}/${symbol}/${monthNumber}`;
    return this.http.get<StockData[]>(url);
  }
}
