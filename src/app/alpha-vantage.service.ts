import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {
  // private readonly API_URL = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH';
  //
  // constructor(private http: HttpClient) { }
  //
  // search(query: string): Observable<any> {
  //   return this.http.get<any>(`${this.API_URL}&keywords=${query}&apikey=${this.API_KEY}`).pipe(
  //     map(response => {
  //       console.log('HTTP Response:', response); // Log the response
  //       return response['bestMatches'];
  //     })
  //   );
  // }
}
