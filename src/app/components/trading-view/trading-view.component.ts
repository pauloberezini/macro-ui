import {Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-trading-view',
  templateUrl: './trading-view.component.html',
  standalone: true,
  styleUrls: ['./trading-view.component.css']
})
export class TradingViewComponent implements OnInit, OnChanges {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() symbol: string = '';

  ngOnInit(): void {
    this.loadTradingViewScript();
  }

  ngOnChanges(_: SimpleChanges): void {
    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    this.renderer.removeChild(container, container.firstChild);
    this.loadTradingViewScript();
  }

  loadTradingViewScript(): void {
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

      dateRanges: [
        '12m|1D',
      ],
      largeChartUrl: ''
    });

    // Append the script to the widget container
    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    this.renderer.appendChild(container, script);
  }
}
