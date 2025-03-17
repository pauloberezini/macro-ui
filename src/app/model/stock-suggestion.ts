export interface StockSuggestion {
  ticker: string;
  title: string;
  cik_str: string;
}

export interface FavoriteStock {
    id: number;
    stockCik: StockSuggestion;
}
