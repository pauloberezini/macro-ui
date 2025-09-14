import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WeekdayReturnsRequest } from '../model/weekday-returns';
import { MonthlyWeekdayReturns, MonthlyWeekdayChartData, MonthlyWeekdayStats } from '../model/monthly-weekday-returns';

@Injectable({
  providedIn: 'root'
})
export class MonthlyWeekdayReturnsService {
  private readonly baseUrl = `${environment.seasonal}/monthly-weekday-returns`;

  constructor(private http: HttpClient) {}

  getDefaultYearRange() {
    const currentYear = new Date().getFullYear();
    return {
      fromYear: currentYear - 5,
      toYear: currentYear
    };
  }

  validateYearRange(fromYear: number, toYear: number): boolean {
    const currentYear = new Date().getFullYear();
    return fromYear >= 1990 && 
           toYear <= currentYear && 
           toYear - fromYear <= 15;
  }

  getMonthlyWeekdayReturns(request: WeekdayReturnsRequest): Observable<MonthlyWeekdayReturns> {
    const url = `${this.baseUrl}/${request.stockSymbol}`;
    const params = {
      fromYear: request.fromYear.toString(),
      toYear: request.toYear.toString()
    };

    return this.http.get<any>(url, { params }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch monthly weekday returns');
        }
        return response.data;
      })
    );
  }

  transformToChartData(data: MonthlyWeekdayReturns): MonthlyWeekdayChartData[] {
    const months = Object.keys(data);
    const chartData: MonthlyWeekdayChartData[] = [];

    months.forEach(month => {
      const weekdayReturns = data[month];
      Object.entries(weekdayReturns).forEach(([weekday, value]) => {
        chartData.push({
          month,
          weekday,
          value: Number(value),
          displayName: this.getWeekdayDisplayName(weekday)
        });
      });
    });

    return chartData.sort((a, b) => {
      const monthOrder = this.getMonthOrder(a.month) - this.getMonthOrder(b.month);
      if (monthOrder !== 0) return monthOrder;
      return this.getWeekdayOrder(a.weekday) - this.getWeekdayOrder(b.weekday);
    });
  }

  calculateSummaryStats(data: MonthlyWeekdayChartData[]): MonthlyWeekdayStats {
    const values = data.map(d => d.value);
    const bestPerformer = data.reduce((max, curr) => curr.value > max.value ? curr : max, data[0]);
    const worstPerformer = data.reduce((min, curr) => curr.value < min.value ? curr : min, data[0]);

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const volatility = Math.sqrt(variance);

    return {
      bestMonth: bestPerformer.month,
      bestWeekday: bestPerformer.displayName,
      bestReturn: bestPerformer.value,
      worstMonth: worstPerformer.month,
      worstWeekday: worstPerformer.displayName,
      worstReturn: worstPerformer.value,
      averageReturn: average,
      volatility: volatility
    };
  }

  private getWeekdayDisplayName(weekday: string): string {
    const displayNames: { [key: string]: string } = {
      'MONDAY': 'Monday',
      'TUESDAY': 'Tuesday',
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday',
      'SUNDAY': 'Sunday'
    };
    return displayNames[weekday] || weekday;
  }

  private getMonthOrder(month: string): number {
    const months = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    return months.indexOf(month);
  }

  private getWeekdayOrder(weekday: string): number {
    const weekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return weekdays.indexOf(weekday);
  }
}