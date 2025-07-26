import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Enhanced AI Profile Data with Fireplexity integration
export interface AiProfileData {
  summary: string;
  tradingStyle: string;
  riskLevel: string;
  preferredMarkets?: string[];
  preferredSectors?: string[];
  topPerformingTrades?: {
    symbol: string;
    returnPercentage: number;
    date: string;
  }[];
  tradingFrequency: string;
  lastUpdated: string;
  insights?: string[];
}

export interface UserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  fullName: string;
}

// Financial Insight from Fireplexity
export interface FinancialInsight {
  ticker: string;
  companyName?: string;
  summary: string;
  sentiment: number;
  keyPoints: string[];
  sources: SourceData[];
  generatedAt: string;
  riskAssessment: string;
  recommendation: string;
}

export interface SourceData {
  url: string;
  title: string;
  summary: string;
  publishedAt: string;
  relevanceScore: number;
  sourceType: string;
}

// Portfolio Analysis
export interface PortfolioAnalysis {
  portfolioSentiment: number;
  riskDistribution: { [key: string]: number };
  recommendationDistribution: { [key: string]: number };
  individualInsights: { [ticker: string]: FinancialInsight };
  totalStocks: number;
  analysisDate: string;
  summary: string;
}

// Ticker News
export interface TickerNewsResponse {
  ticker: string;
  newsCount: number;
  news: FirecrawlResponse[];
}

export interface FirecrawlResponse {
  success: boolean;
  data: {
    content: string;
    markdown: string;
    metadata: {
      title: string;
      description: string;
      sourceURL: string;
      statusCode: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AiProfileService {
  private baseUrl = `${environment.url}/api/ai-profile`;

  constructor(private http: HttpClient) {}

  // ================================
  // 🔹 USER & PROFILE ENDPOINTS
  // ================================

  /** 🔹 Get current user information */
  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/user`);
  }

  /** 🔹 Get enhanced AI profile data for the current user (with Fireplexity) */
  getUserAiProfile(): Observable<AiProfileData> {
    return this.http.get<AiProfileData>(`${this.baseUrl}/profile`);
  }

  /** 🔹 Request AI profile data refresh with latest market data */
  refreshAiProfile(): Observable<AiProfileData> {
    return this.http.post<AiProfileData>(`${this.baseUrl}/refresh`, {});
  }

  // ================================
  // 🔹 FIREPLEXITY ENDPOINTS
  // ================================

  /** 🔹 Get detailed financial insights for a specific ticker */
  getTickerInsights(ticker: string): Observable<FinancialInsight> {
    return this.http.get<FinancialInsight>(`${this.baseUrl}/ticker/${ticker.toUpperCase()}/insights`);
  }

  /** 🔹 Get comprehensive portfolio analysis for user's favorite stocks */
  getPortfolioAnalysis(): Observable<PortfolioAnalysis> {
    return this.http.get<PortfolioAnalysis>(`${this.baseUrl}/portfolio/analysis`);
  }

  /** 🔹 Get recent news for a specific ticker */
  getTickerNews(ticker: string, maxResults: number = 5): Observable<TickerNewsResponse> {
    const params = new HttpParams().set('maxResults', maxResults.toString());
    return this.http.get<TickerNewsResponse>(`${this.baseUrl}/ticker/${ticker.toUpperCase()}/news`, { params });
  }

  // ================================
  // 🔹 UTILITY METHODS
  // ================================

  /** 🔹 Format sentiment score to readable text */
  formatSentiment(sentiment: number): string {
    if (sentiment > 0.3) return 'Positive';
    if (sentiment < -0.3) return 'Negative';
    return 'Neutral';
  }

  /** 🔹 Get sentiment color for display */
  getSentimentColor(sentiment: number): string {
    if (sentiment > 0.3) return '#4caf50'; // Green
    if (sentiment < -0.3) return '#f44336'; // Red
    return '#ff9800'; // Orange
  }

  /** 🔹 Format risk level with appropriate styling */
  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#757575';
    }
  }

  /** 🔹 Get recommendation styling */
  getRecommendationColor(recommendation: string): string {
    switch (recommendation?.toLowerCase()) {
      case 'buy': return '#4caf50';
      case 'sell': return '#f44336';
      case 'hold': return '#ff9800';
      default: return '#757575';
    }
  }
} 