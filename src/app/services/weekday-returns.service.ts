import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  WeekdayReturns,
  MonthlyWeekdayReturns,
  WeekdayReturnsRequest,
  WeekdayChartData,
  MonthlyWeekdayChartData,
  WEEKDAY_DISPLAY_NAMES,
  TRADING_WEEKDAYS,
  WeekdayName
} from '../model/weekday-returns';

@Injectable({
  providedIn: 'root'
})
export class WeekdayReturnsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.seasonal;

  /**
   * Fetches weekday average returns for a stock
   */
  getWeekdayReturns(request: WeekdayReturnsRequest): Observable<WeekdayReturns> {
    const params = new HttpParams()
      .set('fromYear', request.fromYear.toString())
      .set('toYear', request.toYear.toString());

    return this.http.get<ApiResponse<WeekdayReturns>>(
      `${this.baseUrl}/weekday-returns/${request.stockSymbol}`,
      { params }
    ).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch weekday returns');
        }
      }),
      catchError(error => {
        console.error('Error fetching weekday returns:', error);
        return throwError(() => new Error('Failed to fetch weekday returns. Please try again.'));
      })
    );
  }

  /**
   * Fetches monthly weekday average returns for a stock
   */
  getMonthlyWeekdayReturns(request: WeekdayReturnsRequest): Observable<MonthlyWeekdayReturns> {
    const params = new HttpParams()
      .set('fromYear', request.fromYear.toString())
      .set('toYear', request.toYear.toString());

    return this.http.get<ApiResponse<MonthlyWeekdayReturns>>(
      `${this.baseUrl}/monthly-weekday-returns/${request.stockSymbol}`,
      { params }
    ).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch monthly weekday returns');
        }
      }),
      catchError(error => {
        console.error('Error fetching monthly weekday returns:', error);
        return throwError(() => new Error('Failed to fetch monthly weekday returns. Please try again.'));
      })
    );
  }

  /**
   * Transforms weekday returns data into chart format
   */
  transformToChartData(weekdayReturns: WeekdayReturns): WeekdayChartData[] {
    return TRADING_WEEKDAYS.map(day => ({
      day: day,
      value: weekdayReturns[day] || 0,
      displayName: WEEKDAY_DISPLAY_NAMES[day]
    }));
  }

  /**
   * Transforms monthly weekday returns data into chart format
   */
  transformToMonthlyChartData(monthlyReturns: MonthlyWeekdayReturns): MonthlyWeekdayChartData[] {
    return Object.entries(monthlyReturns).map(([month, weekdayData]) => ({
      month: month,
      data: this.transformToChartData(weekdayData)
    }));
  }

  /**
   * Calculates summary statistics for weekday returns
   */
  calculateSummaryStats(weekdayReturns: WeekdayReturns): {
    bestDay: { day: string; return: number };
    worstDay: { day: string; return: number };
    averageReturn: number;
    volatility: number;
  } {
    const tradingDayReturns = TRADING_WEEKDAYS.map(day => ({
      day: WEEKDAY_DISPLAY_NAMES[day],
      return: weekdayReturns[day] || 0
    }));

    const returns = tradingDayReturns.map(item => item.return);
    const bestDay = tradingDayReturns.reduce((best, current) =>
      current.return > best.return ? current : best
    );
    const worstDay = tradingDayReturns.reduce((worst, current) =>
      current.return < worst.return ? current : worst
    );

    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    return {
      bestDay,
      worstDay,
      averageReturn,
      volatility
    };
  }

  /**
   * Gets the current year range for default requests
   */
  getDefaultYearRange(): { fromYear: number; toYear: number } {
    const currentYear = new Date().getFullYear();
    return {
      fromYear: currentYear - 20,
      toYear: currentYear
    };
  }

  /**
   * Validates year range
   */
  validateYearRange(fromYear: number, toYear: number): { valid: boolean; error?: string } {
    if (fromYear > toYear) {
      return { valid: false, error: 'From year cannot be greater than to year' };
    }

    const currentYear = new Date().getFullYear();
    if (toYear > currentYear) {
      return { valid: false, error: 'To year cannot be in the future' };
    }

    if (fromYear < 1990) {
      return { valid: false, error: 'From year cannot be before 1990' };
    }

    return { valid: true };
  }
}
