import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-trading-view-chart',
  templateUrl: './trading-view-chart.component.html',
  standalone: true,
  styleUrls: ['./trading-view-chart.component.css'],
})
export class TradingViewChartComponent implements OnInit, OnChanges {
  private isInitialized = false; // Track if the component has been initialized

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @Input() symbol: string = '';

  ngOnInit(): void {
    console.log('TradingView Chart component initialized');
    this.isInitialized = true; // Mark the component as initialized
    if (this.symbol) {
      this.loadTradingViewScript();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('TradingView Chart ngOnChanges called:', changes);

    if (!this.isInitialized) {
      console.log('Component not initialized yet, skipping...');
      return; // Skip if the component has not been initialized
    }

    if (!this.symbol) {
      console.warn('Symbol is not set or invalid:', this.symbol);
      return;
    }

    console.log('Loading TradingView chart for symbol:', this.symbol);

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    console.log('Container found:', !!container);

    if (container && container.firstChild) {
      console.log('Removing existing script');
      this.renderer.removeChild(container, container.firstChild);
    }

    this.loadTradingViewScript();
  }

  loadTradingViewScript(): void {
    console.log('loadTradingViewScript called with symbol:', this.symbol);

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    if (!container) {
      console.error('TradingView container not found!');
      return;
    }

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;

    const config = {
      symbols: [[`${this.symbol}`]],
      chartOnly: false,
      width: '100%',
      height: '100%',
      locale: 'en',
      colorTheme: 'light',
      gridLineColor: '#f0f3fa',
      trendLineColor: '#2196f3',
      fontColor: '#787b86',
      isTransparent: false,
      autosize: true,
      dateRanges: ['12m|1D'],
      largeChartUrl: '',
    };

    console.log('TradingView config:', config);
    script.text = JSON.stringify(config);

    console.log('Appending TradingView script to container');
    this.renderer.appendChild(container, script);

    // Add error handling
    script.onerror = (error: Event) => {
      console.error('Failed to load TradingView script:', error);
    };

    script.onload = () => {
      console.log('TradingView script loaded successfully');
    };
  }
}
