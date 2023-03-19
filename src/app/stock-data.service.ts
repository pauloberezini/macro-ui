import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData } from './stock-data';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private baseUrl = 'https://server.berezini.com/historical-data';

  constructor(private http: HttpClient) { }

  getStockData(symbol: string, fromYear: number, toYear: number): Observable<StockData[]> {
    const url = `${this.baseUrl}/${symbol}/${fromYear}/${toYear}`;
    console.log(url)
    return this.http.get<StockData[]>(url);
  }
}
