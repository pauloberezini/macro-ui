import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StockData} from '../model/stock-data';
import {environment} from "../../environments/environment";
import {EventDto} from "../model/event-dto";
import {HockeyTeamStats} from "../model/hockey-teams-stats";
import {Article} from "../model/article";
import {NewsSentiment} from "../model/news-sentiment";
import {StorageResponseDTO} from "../model/gas-storage";
import {InsiderData} from "../model/InsiderData";
import {StockSuggestion} from "../model/stock-suggestion";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private url = environment.url; // Use the environment variable

  private baseUrl = environment.baseUrl; // Use the environment variable

  private baseUrlAllDaily = environment.baseUrlAllDaily; // Use the environment variable
  private baseUrlYearAllDaily = environment.baseUrlYearAllDaily; // Use the environment variable

  private baseUrlAlpha = environment.baseUrlAlpha; // Use the environment variable
  private baseUrlDynamicData = environment.baseUrlDynamicData; // Use the environment variable


  constructor(private http: HttpClient) {
  }

  getStockData(symbol: string, fromYear: number, toYear: number): Observable<StockData[]> {
    const url = `${this.baseUrl}/${symbol}/${fromYear}/${toYear}`;
    return this.http.get<StockData[]>(url);
  }


  getDynamicData(currency: string, eventName: string): Observable<any> {
    const url = `${this.baseUrlDynamicData}`;
    const body = {
      currency: currency,
      eventName: eventName
    };

    return this.http.post<any>(url, body);
  }

// Add this method to StockDataService
  getSentimentSummary(): Observable<any[]> {
    const url = `${this.url}/api/sentiment/summary`;
    return this.http.get<any[]>(url);
  }

  getEconomicData(type: string): Observable<Object[]> {
    const url = `${this.baseUrlAlpha}/economic/${type}`;
    return this.http.get<Object[]>(url);
  }

  getNhlData(): Observable<HockeyTeamStats[]> {
    const url = `${this.url}/nhl/standings`;
    return this.http.get<HockeyTeamStats[]>(url);
  }

  getPreviousNhlData(): Observable<any> {
    return this.http.get(`${this.url}/nhl/previousstandings`);
  }


  getGasStorageData(): Observable<StorageResponseDTO> {
    const url = `${this.url}/agsi/storageData`;
    return this.http.get<StorageResponseDTO>(url);
  }


  getStockAlphaData(symbol: string): Observable<StockData[]> {
    const url = `${this.baseUrlAlpha}/STOCK-M/${symbol}`;
    return this.http.get<StockData[]>(url);
  }

  getStockAllDailyData(symbol: string, monthNumber: string): Observable<StockData[]> {
    const url = `${this.baseUrlAllDaily}/${symbol}/${monthNumber}`;
    return this.http.get<StockData[]>(url);
  }

  getStockYearAllDaily(symbol: string): Observable<StockData[]> {
    const url = `${this.baseUrlYearAllDaily}/${symbol}`;
    return this.http.get<StockData[]>(url);
  }

  getHighNews(): Observable<EventDto[]> {
    const url = `${this.url}/getNews`;
    return this.http.get<EventDto[]>(url);
  }

  getMarketNews(): Observable<Article[]> {
    const url = `${this.url}/api/news/business-news`;
    return this.http.get<Article[]>(url);
  }

  getChartSentiment(period: string): Observable<NewsSentiment> {
    const url = `${this.url}/api/news/sentiment/${period}`;
    return this.http.get<NewsSentiment>(url);
  }


  getNewsTitles(currency: string): Observable<any> {
    const url = `${this.baseUrlAlpha}/dynamic/getAllMacroTitles/${currency}`;
    return this.http.get<any>(url);
  }

  getInsidersDataForStock(stockName: string): Observable<InsiderData[]> {
    const url = `${this.url}/api/insiders/${stockName}`;
    return this.http.get<InsiderData[]>(url);
  }

  suggest(query: string): Observable<StockSuggestion[]> {
    const url = `${this.url}/api/insiders/autosuggest`;
    return this.http.get<StockSuggestion[]>(url, {params: new HttpParams().set('query', query)});
  }

  getStockAlphaData25(stockName: string, election: string): Observable<StockData[]> {
    const url = `${this.baseUrl}/25/${stockName}/${election}`;
    return this.http.get<StockData[]>(url);
  }


  getSeasonalData(stockName: string, election: string = 'regular'): Observable<any> {
    const url = `${environment.seasonal}/${stockName}`;
    const params = new HttpParams().set('election', election);
    return this.http.get<any>(url, { params });
  }

  getCurrentYearData(stockName: string): Observable<any> {
    const url = `${environment.seasonal}/current-year/${stockName}`;
    return this.http.get<any>(url);
  }
}
``
