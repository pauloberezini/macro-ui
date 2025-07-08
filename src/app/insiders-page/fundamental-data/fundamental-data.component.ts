import {Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-fundamental-data',
  templateUrl: `./fundamental-data.component.html`,
  styleUrls: ['./fundamental-data.component.css'],
  standalone: true
})
export class FundamentalDataComponent implements OnInit, OnChanges {
  @Input() symbol: string = ''; // Symbol input to dynamically provide
  private isInitialized = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    console.log('Fundamental Data component initialized');
    this.isInitialized = true;
    if (this.symbol) {
      this.loadFundamentalDataScript();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Fundamental Data ngOnChanges called:', changes);

    if (!this.isInitialized) {
      console.log('Component not initialized yet, skipping...');
      return;
    }

    if (!this.symbol) {
      console.warn('No symbol provided for Fundamental Data widget.');
      return;
    }

    console.log('Loading Fundamental Data for symbol:', this.symbol);

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    console.log('Container found:', !!container);

    // Remove the old script if it exists
    if (container && container.firstChild) {
      console.log('Removing existing script');
      this.renderer.removeChild(container, container.firstChild);
    }

    this.loadFundamentalDataScript();
  }

  loadFundamentalDataScript(): void {
    console.log('loadFundamentalDataScript called with symbol:', this.symbol);

    const container = this.el.nativeElement.querySelector('.tradingview-widget-container__widget');
    if (!container) {
      console.error('Fundamental Data container not found!');
      return;
    }

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
      symbol: '' + this.symbol,
      locale: "en",
    };

    console.log('Fundamental Data config:', config);
    script.text = JSON.stringify(config);

    console.log('Appending Fundamental Data script to container');
    this.renderer.appendChild(container, script);

    // Add error handling
    script.onerror = (error: any) => {
      console.error('Failed to load Fundamental Data script:', error);
    };

    script.onload = () => {
      console.log('Fundamental Data script loaded successfully');
    };
  }
}
