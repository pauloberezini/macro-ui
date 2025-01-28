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

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() symbol: string = '';

  ngOnInit(): void {
    this.isInitialized = true; // Mark the component as initialized
    this.loadTradingViewScript();
  }

  ngOnChanges(_: SimpleChanges): void {
    if (!this.isInitialized) {
      return; // Skip if the component has not been initialized
    }

    if (!this.symbol) {
      console.warn('Symbol is not set or invalid:', this.symbol);
      return;
    }

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    if (container && container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }

    this.loadTradingViewScript();
  }

  loadTradingViewScript(): void {
    console.log('Symbol passed to widget script:', this.symbol);

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.text = JSON.stringify({
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
    });

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    if (container) {
      this.renderer.appendChild(container, script);
    }
  }
}
