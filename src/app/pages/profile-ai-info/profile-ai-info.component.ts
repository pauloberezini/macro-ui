import { Component, OnInit, Input, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import {
  AiProfileService,
  AiProfileData,
  PortfolioAnalysis,
  FinancialInsight,
  TickerNewsResponse
} from '../../services/ai-profile.service';
import { StockSuggestion } from '../../model/stock-suggestion';
import { catchError, finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile-ai-info',
  templateUrl: './profile-ai-info.component.html',
  styleUrls: ['./profile-ai-info.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MarkdownModule
  ],
  providers: [provideMarkdown()]
})
export class ProfileAiInfoComponent implements OnInit, OnChanges {
  @Input() favoriteStocks: StockSuggestion[] = [];
  @Input() selectedTicker: string = '';

  // Signals for reactive state management
  readonly aiData = signal<AiProfileData | null>(null);
  readonly portfolioAnalysis = signal<PortfolioAnalysis | null>(null);
  readonly tickerInsights = signal<{ [ticker: string]: FinancialInsight }>({});
  readonly tickerNews = signal<{ [ticker: string]: TickerNewsResponse }>({});

  readonly isLoadingProfile = signal<boolean>(false);
  readonly isLoadingPortfolio = signal<boolean>(false);
  readonly isLoadingTicker = signal<string | null>(null);
  readonly isLoadingNews = signal<string | null>(null);

  readonly profileError = signal<string | null>(null);
  readonly portfolioError = signal<string | null>(null);
  readonly tickerError = signal<string | null>(null);

  readonly selectedTickerForInsights = signal<string>('');
  searchTicker = signal<string>('');

  // Zoom functionality
  readonly isSummaryZoomed = signal<boolean>(false);

  // Computed values
  readonly hasAnyData = computed(() =>
    this.aiData() || this.portfolioAnalysis() || Object.keys(this.tickerInsights()).length > 0
  );

  readonly favoriteTickersList = computed(() =>
    this.favoriteStocks.map(stock => stock.ticker).filter(Boolean)
  );

  readonly overallSentiment = computed(() => {
    const portfolio = this.portfolioAnalysis();
    if (portfolio) {
      return this.aiProfileService.formatSentiment(portfolio.portfolioSentiment);
    }
    return 'Unknown';
  });

  readonly sentimentColor = computed(() => {
    const portfolio = this.portfolioAnalysis();
    if (portfolio) {
      return this.aiProfileService.getSentimentColor(portfolio.portfolioSentiment);
    }
    return '#757575';
  });

  constructor(
    private aiProfileService: AiProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Load general AI profile data
    this.loadAiProfile();
    
    // If a ticker is selected, load ticker-specific data
    if (this.selectedTicker) {
      this.loadTickerData(this.selectedTicker);
    }
  }

  // Method to handle ticker selection changes
  ngOnChanges() {
    if (this.selectedTicker && this.selectedTicker !== this.selectedTickerForInsights()) {
      this.loadTickerData(this.selectedTicker);
    }
  }

  // Load ticker-specific data
  loadTickerData(ticker: string) {
    if (!ticker || ticker.trim() === '') return;
    
    this.selectedTickerForInsights.set(ticker.toUpperCase());
    this.loadTickerInsights(ticker);
    this.loadTickerNews(ticker);
  }

  // ================================
  // 🔹 AI PROFILE METHODS
  // ================================

  loadAiProfile() {
    this.isLoadingProfile.set(true);
    this.profileError.set(null);

    this.aiProfileService.getUserAiProfile()
      .pipe(
        catchError(err => {
          console.error('Error loading AI profile:', err);
          this.profileError.set('Failed to load AI profile data. Please try again later.');
          return of(null);
        }),
        finalize(() => this.isLoadingProfile.set(false))
      )
      .subscribe(data => {
        if (data) {
          this.aiData.set(data);
        }
      });
  }

  refreshProfile() {
    this.isLoadingProfile.set(true);
    this.profileError.set(null);

    this.aiProfileService.refreshAiProfile()
      .pipe(
        catchError(err => {
          console.error('Error refreshing AI profile:', err);
          this.profileError.set('Failed to refresh AI profile data. Please try again later.');
          return of(null);
        }),
        finalize(() => this.isLoadingProfile.set(false))
      )
      .subscribe(data => {
        if (data) {
          this.aiData.set(data);
          this.showSuccessMessage('AI profile refreshed with latest market data!');
        }
      });
  }

  // ================================
  // 🔹 PORTFOLIO ANALYSIS METHODS
  // ================================

  loadPortfolioAnalysis() {
    if (this.favoriteTickersList().length === 0) {
      this.portfolioError.set('No favorite stocks found. Add some stocks to get portfolio analysis.');
      return;
    }

    this.isLoadingPortfolio.set(true);
    this.portfolioError.set(null);

    this.aiProfileService.getPortfolioAnalysis()
      .pipe(
        catchError(err => {
          console.error('Error loading portfolio analysis:', err);
          this.portfolioError.set('Failed to load portfolio analysis. Please try again later.');
          return of(null);
        }),
        finalize(() => this.isLoadingPortfolio.set(false))
      )
      .subscribe(analysis => {
        if (analysis) {
          this.portfolioAnalysis.set(analysis);
          this.showSuccessMessage(`Portfolio analysis loaded for ${analysis.totalStocks} stocks!`);
        }
      });
  }

  // ================================
  // 🔹 TICKER INSIGHTS METHODS
  // ================================

  loadTickerInsights(ticker: string) {
    if (!ticker || ticker.trim() === '') return;

    const upperTicker = ticker.toUpperCase();
    this.isLoadingTicker.set(upperTicker);
    this.tickerError.set(null);

    this.aiProfileService.getTickerInsights(upperTicker)
      .pipe(
        catchError(err => {
          console.error(`Error loading insights for ${upperTicker}:`, err);
          this.tickerError.set(`Failed to load insights for ${upperTicker}. Please try again.`);
          return of(null);
        }),
        finalize(() => this.isLoadingTicker.set(null))
      )
      .subscribe(insights => {
        if (insights) {
          this.tickerInsights.update(current => ({
            ...current,
            [upperTicker]: insights
          }));
          this.showSuccessMessage(`Insights loaded for ${upperTicker}!`);
        }
      });
  }

  loadAllFavoriteInsights() {
    const tickers = this.favoriteTickersList();
    if (tickers.length === 0) {
      this.tickerError.set('No favorite stocks found. Add some stocks first.');
      return;
    }

    this.tickerError.set(null);

    // Load insights for all favorite tickers concurrently
    const requests = tickers.map(ticker =>
      this.aiProfileService.getTickerInsights(ticker).pipe(
        catchError(err => {
          console.error(`Error loading insights for ${ticker}:`, err);
          return of(null);
        })
      )
    );

    this.isLoadingTicker.set('ALL');

    forkJoin(requests)
      .pipe(finalize(() => this.isLoadingTicker.set(null)))
      .subscribe(results => {
        const insights: { [ticker: string]: FinancialInsight } = {};
        results.forEach((insight, index) => {
          if (insight) {
            insights[tickers[index]] = insight;
          }
        });

        if (Object.keys(insights).length > 0) {
          this.tickerInsights.set(insights);
          this.showSuccessMessage(`Loaded insights for ${Object.keys(insights).length} stocks!`);
        } else {
          this.tickerError.set('Failed to load insights for any stocks.');
        }
      });
  }

  searchTickerInsights() {
    const ticker = this.searchTicker().trim();
    if (ticker) {
      this.loadTickerInsights(ticker);
      this.selectedTickerForInsights.set(ticker.toUpperCase());
    }
  }

  // ================================
  // 🔹 NEWS METHODS
  // ================================

  loadTickerNews(ticker: string, maxResults: number = 5) {
    if (!ticker || ticker.trim() === '') return;

    const upperTicker = ticker.toUpperCase();
    this.isLoadingNews.set(upperTicker);

    this.aiProfileService.getTickerNews(upperTicker, maxResults)
      .pipe(
        catchError(err => {
          console.error(`Error loading news for ${upperTicker}:`, err);
          return of(null);
        }),
        finalize(() => this.isLoadingNews.set(null))
      )
      .subscribe(news => {
        if (news) {
          this.tickerNews.update(current => ({
            ...current,
            [upperTicker]: news
          }));
          this.showSuccessMessage(`News loaded for ${upperTicker}!`);
        }
      });
  }

  // ================================
  // 🔹 UTILITY METHODS
  // ================================

  getInsightsByTicker(ticker: string): FinancialInsight | null {
    return this.tickerInsights()[ticker.toUpperCase()] || null;
  }

  getNewsByTicker(ticker: string): TickerNewsResponse | null {
    return this.tickerNews()[ticker.toUpperCase()] || null;
  }

  getSentimentColor(sentiment: number): string {
    return this.aiProfileService.getSentimentColor(sentiment);
  }

  getRiskLevelColor(riskLevel: string): string {
    return this.aiProfileService.getRiskLevelColor(riskLevel);
  }

  getRecommendationColor(recommendation: string): string {
    return this.aiProfileService.getRecommendationColor(recommendation);
  }

  formatSentiment(sentiment: number): string {
    return this.aiProfileService.formatSentiment(sentiment);
  }

  // Helper methods for template
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getObjectEntries(obj: any): [string, any][] {
    return Object.entries(obj);
  }

  hasTickerInsights(): boolean {
    return Object.keys(this.tickerInsights()).length > 0;
  }

  hasTickerNews(): boolean {
    return Object.keys(this.tickerNews()).length > 0;
  }

  // Zoom functionality
  toggleSummaryZoom(): void {
    this.isSummaryZoomed.update(current => !current);
    
    // Scroll to top when zooming in to ensure full visibility
    if (!this.isSummaryZoomed()) {
      setTimeout(() => {
        const summaryElement = document.querySelector('.summary-text');
        if (summaryElement) {
          summaryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
      });
  }
}
