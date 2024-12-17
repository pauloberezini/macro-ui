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
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.text = JSON.stringify({
      autosize: false,
      symbol: `${this.symbol}`,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      calendar: false,
      support_host: 'https://www.tradingview.com'
    });

    // Append the script to the widget container
    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    this.renderer.appendChild(container, script);
  }
}
