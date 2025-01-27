import {Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-fundamental-data',
  templateUrl: `./fundamental-data.component.html`,
  styleUrls: ['./fundamental-data.component.css'],
  standalone: true
})
export class FundamentalDataComponent implements OnChanges {
  @Input() symbol: string = ''; // Symbol input to dynamically provide

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(_: SimpleChanges): void {
    if (!this.symbol) {
      console.warn('No symbol provided for Fundamental Data widget.');
      return;
    }

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');

    // Remove the old script if it exists
    if (container && container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }

    this.loadFundamentalDataScript();
  }

  loadFundamentalDataScript(): void {
    console.log('Loading Fundamental Data widget for symbol:', this.symbol);

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    script.async = true;

    const config = {
      isTransparent: false,
      largeChartUrl: "",
      displayMode: "regular",
      width: "100%", // Responsive width
      height: "100%", // Responsive height
      colorTheme: "light",
      symbol: 'NASDAQ:' + this.symbol,
      locale: "en",
    };

    console.log('Widget configuration:', config); // Debugging configuration
    script.text = JSON.stringify(config);

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    if (container) {
      this.renderer.appendChild(container, script);
    } else {
      console.error('Widget container not found.');
    }
  }
}
