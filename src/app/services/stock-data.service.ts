import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData } from '../model/stock-data';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
//  private url = 'http://localhost:8089';
//   private baseUrl = 'http://localhost:8089/historical-data';
//   private baseUrlAllDaily = 'http://localhost:8089/historical-data/daily/all';
//   private baseUrlAlpha = 'http://localhost:8089/alpha/historical-data';
  private baseUrlAlpha = 'https://server.berezini.com/alpha/historical-data';
  private url = 'https://server.berezini.com';
  private baseUrl = 'https://server.berezini.com/historical-data';
  private baseUrlAllDaily = 'https://server.berezini.com/historical-data/daily/all';

  constructor(private http: HttpClient) { }

  getStockData(symbol: string, fromYear: number, toYear: number): Observable<StockData[]> {
    const url = `${this.baseUrl}/${symbol}/${fromYear}/${toYear}`;
    return this.http.get<StockData[]>(url);
  }


  getFXData(symbol: string): Observable<StockData[]> {
    const url = `${this.baseUrlAlpha}/FX-M/${symbol}`;
    return this.http.get<StockData[]>(url);
  }

  getEconomicData(type: string): Observable<Object[]> {
    const url = `${this.baseUrlAlpha}/economic/${type}`;
    return this.http.get<Object[]>(url);
  }


  getStockAlphaData(symbol: string): Observable<StockData[]> {
    const url = `${this.baseUrlAlpha}/STOCK-M/${symbol}`;
    return this.http.get<StockData[]>(url);
  }

  
  getStockAllDailyData(symbol: string, monthNumber: string): Observable<StockData[]> {
    const url = `${this.baseUrlAllDaily}/${symbol}/${monthNumber}`;
    return this.http.get<StockData[]>(url);
  }
  
  getHighNews(): Observable<StockData[]> {
    const url = `${this.url}/getHighNews`;
    return this.http.get<StockData[]>(url);
  }
  getMarketNews(): Observable<StockData[]> {
    const url = `${this.url}/api/news/business-news`;
    return this.http.get<StockData[]>(url);
  }
}
