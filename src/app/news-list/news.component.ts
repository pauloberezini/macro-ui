import { Component, OnInit } from '@angular/core';
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
import {DateFormatPipe} from "../model/date-format-pipe";
import {TruncatePipe} from "../model/truncate-pipe";
import {NgClass, NgForOf} from "@angular/common";

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
    DateFormatPipe,
    TruncatePipe,
    NgClass,
    NgForOf
  ],
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  articles: Article[] = [];
  sentimentData: any[] = []; // Add the sentimentData array
  truncateLength: number = 100;
  private mediaSub: Subscription;

  constructor(
    private metaTagService: Meta,
    private stockDataService: StockDataService
  ) { }

  ngOnInit(): void {
    this.metaTagService.addTags([
      { name: 'description', content: 'Stay ahead of the market with AI-powered news sentiment analysis. Understand market mood with Berezini Partners’ real-time sentiment scope for financial news.' },
      { name: 'keywords', content: 'AI sentiment analysis, financial news, market trends, real-time news sentiment, market mood, Berezini Partners, news sentiment scope, AI analytics' },
      { property: 'og:title', content: 'AI-Powered News Sentiment Analysis | Berezini Partners' },
      { property: 'og:description', content: 'Get the pulse of the market with AI-driven sentiment analysis of the latest financial news. Make informed decisions with Berezini Partners.' },
      { property: 'og:url', content: 'https://macro.berezini.com/app-news' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://macro.berezini.com/assets/images/news-sentiment-og-image.png' },
    ]);

    this.stockDataService.getMarketNews().subscribe((data: any) => {
      this.articles = data;
    });

    // Fetch sentiment data
    this.stockDataService.getSentimentSummary().subscribe((data: any[]) => {
      this.sentimentData = data;
    });

  }
}
