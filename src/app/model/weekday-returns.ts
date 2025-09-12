/**
 * Interface for API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Interface for weekday return data
 */
export interface WeekdayReturns {
  MONDAY: number;
  TUESDAY: number;
  WEDNESDAY: number;
  THURSDAY: number;
  FRIDAY: number;
  SATURDAY?: number;
  SUNDAY?: number;
}

/**
 * Interface for monthly weekday returns data
 */
export interface MonthlyWeekdayReturns {
  [month: string]: WeekdayReturns;
}

/**
 * Interface for chart data point
 */
export interface WeekdayChartData {
  day: string;
  value: number;
  displayName: string;
}

/**
 * Interface for monthly chart data
 */
export interface MonthlyWeekdayChartData {
  month: string;
  data: WeekdayChartData[];
}

/**
 * Interface for weekday returns request parameters
 */
export interface WeekdayReturnsRequest {
  stockSymbol: string;
  fromYear: number;
  toYear: number;
}

/**
 * Enum for weekday names
 */
export enum WeekdayName {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

/**
 * Display names for weekdays
 */
export const WEEKDAY_DISPLAY_NAMES: Record<WeekdayName, string> = {
  [WeekdayName.MONDAY]: 'Monday',
  [WeekdayName.TUESDAY]: 'Tuesday',
  [WeekdayName.WEDNESDAY]: 'Wednesday',
  [WeekdayName.THURSDAY]: 'Thursday',
  [WeekdayName.FRIDAY]: 'Friday',
  [WeekdayName.SATURDAY]: 'Saturday',
  [WeekdayName.SUNDAY]: 'Sunday'
};

/**
 * Trading weekdays (excluding weekend)
 */
export const TRADING_WEEKDAYS: WeekdayName[] = [
  WeekdayName.MONDAY,
  WeekdayName.TUESDAY,
  WeekdayName.WEDNESDAY,
  WeekdayName.THURSDAY,
  WeekdayName.FRIDAY
];

