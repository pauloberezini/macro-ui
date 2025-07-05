import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockDataService } from '../services/stock-data.service';
import { Meta } from "@angular/platform-browser";
import { Article } from "../model/article";
import { Subscription } from 'rxjs';
import {PieChartComponent} from "../pie-chart/pie-chart.component";
import {SentimentLineChartComponent} from "../sentiment-line-chart/sentiment-line-chart.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {DateFormatPipe} from "../model/date-format-pipe";
import {TruncatePipe} from "../model/truncate-pipe";
import {NgClass, NgForOf, NgIf} from "@angular/common";

export type SentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  standalone: true,
  imports: [
    PieChartComponent,
    SentimentLineChartComponent,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    DateFormatPipe,
    TruncatePipe,
    NgClass,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

  articles: Article[] = [];
  allArticles: Article[] = []; // Store original unfiltered articles
  filteredArticles: Article[] = []; // Store filtered articles
  sentimentData: any[] = [];
  truncateLength: number = 100;
  activeFilter: SentimentFilter = 'all';
  showScrollToTop: boolean = false;
  private mediaSub: Subscription;
  private scrollHandler: () => void;

  // Filter options for the UI
  filterOptions = [
    { key: 'all' as SentimentFilter, label: 'All', icon: 'select_all' },
    { key: 'positive' as SentimentFilter, label: 'Positive', icon: 'trending_up' },
    { key: 'negative' as SentimentFilter, label: 'Negative', icon: 'trending_down' },
    { key: 'neutral' as SentimentFilter, label: 'Neutral', icon: 'trending_flat' }
  ];

  constructor(
    private metaTagService: Meta,
    private stockDataService: StockDataService
  ) { }

  ngOnInit(): void {
    this.setMetaTags();
    this.loadNewsData();
    this.loadSentimentData();
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  private setMetaTags(): void {
    this.metaTagService.addTags([
      { name: 'description', content: 'Stay ahead of the market with AI-powered news sentiment analysis. Understand market mood with Berezini Partners\' real-time sentiment scope for financial news.' },
      { name: 'keywords', content: 'AI sentiment analysis, financial news, market trends, real-time news sentiment, market mood, Berezini Partners, news sentiment scope, AI analytics' },
      { property: 'og:title', content: 'AI-Powered News Sentiment Analysis | Berezini Partners' },
      { property: 'og:description', content: 'Get the pulse of the market with AI-driven sentiment analysis of the latest financial news. Make informed decisions with Berezini Partners.' },
      { property: 'og:url', content: 'https://macro.berezini.com/app-news' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://macro.berezini.com/assets/images/news-sentiment-og-image.png' },
    ]);
  }

  private loadNewsData(): void {
    this.stockDataService.getMarketNews().subscribe({
      next: (data: any) => {
        this.allArticles = data;
        this.articles = [...data]; // Initialize filtered articles
        this.applyFilter(this.activeFilter);
      },
      error: (error) => {
        console.error('Error loading news data:', error);
      }
    });
  }

  private loadSentimentData(): void {
    this.stockDataService.getSentimentSummary().subscribe({
      next: (data: any[]) => {
        this.sentimentData = data;
      },
      error: (error) => {
        console.error('Error loading sentiment data:', error);
      }
    });
  }

  // Filter functionality
  onFilterChange(filter: SentimentFilter): void {
    this.activeFilter = filter;
    this.applyFilter(filter);
  }

  private applyFilter(filter: SentimentFilter): void {
    if (filter === 'all') {
      this.articles = [...this.allArticles];
    } else {
      this.articles = this.allArticles.filter(article => 
        article.sentiment?.toLowerCase() === filter.toLowerCase()
      );
    }
  }

  // Get sentiment distribution for quick stats
  getSentimentDistribution() {
    if (this.allArticles.length === 0) {
      return { positive: 0, negative: 0, neutral: 0 };
    }

    const total = this.allArticles.length;
    const positive = this.allArticles.filter(a => a.sentiment?.toLowerCase() === 'positive').length;
    const negative = this.allArticles.filter(a => a.sentiment?.toLowerCase() === 'negative').length;
    const neutral = this.allArticles.filter(a => a.sentiment?.toLowerCase() === 'neutral').length;

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100)
    };
  }

  // Get filter badge count
  getFilterCount(filter: SentimentFilter): number {
    if (filter === 'all') {
      return this.allArticles.length;
    }
    return this.allArticles.filter(article => 
      article.sentiment?.toLowerCase() === filter.toLowerCase()
    ).length;
  }

  trackByArticle(index: number, article: Article): string {
    return article.url || index.toString();
  }

  getSentimentLabel(sentiment: string): string {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      case 'neutral':
        return 'Neutral';
      default:
        return 'Unknown';
    }
  }

  getSentimentIcon(sentiment: string): string {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'trending_up';
      case 'negative':
        return 'trending_down';
      case 'neutral':
        return 'trending_flat';
      default:
        return 'help';
    }
  }

  // Scroll to top functionality
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Setup scroll listener to show/hide scroll to top button
  private setupScrollListener(): void {
    this.scrollHandler = () => {
      this.showScrollToTop = window.pageYOffset > 300;
    };
    window.addEventListener('scroll', this.scrollHandler);
  }
}
