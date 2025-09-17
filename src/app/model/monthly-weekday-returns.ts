import { WeekdayReturns } from './weekday-returns';

export interface MonthlyWeekdayReturns {
  [month: string]: WeekdayReturns;
}

export interface MonthlyWeekdayChartData {
  month: string;
  weekday: string;
  value: number;
  displayName: string;
}

export interface MonthlyWeekdayStats {
  bestMonth: string;
  bestWeekday: string;
  bestReturn: number;
  worstMonth: string;
  worstWeekday: string;
  worstReturn: number;
  averageReturn: number;
  volatility: number;
}
