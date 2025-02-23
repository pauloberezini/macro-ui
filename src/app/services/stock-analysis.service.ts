import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from "../../environments/environment";

export interface StockAnalysisModel {
  ticker: string;
  anomaly_count: number;
  mean_change: number;
  max_price: number;
  min_price: number;
  graph_data: any;
}

@Injectable({
  providedIn: 'root'
})
export class StockAnalysisService {
  private url = environment.url;
  private apiUrl = `${this.url}/proxy/analyze`;

  constructor(private http: HttpClient) { }

  analyzeStock(ticker: string): Observable<StockAnalysisModel> {
    return this.http.get<StockAnalysisModel>(`${this.apiUrl}?ticker=${ticker}`)
      .pipe(
        delay(1000) // Simulates a 1-second delay for testing purposes
      );
  }
}
