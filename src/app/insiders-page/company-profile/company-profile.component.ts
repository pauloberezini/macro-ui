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
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  standalone: true,
  styleUrls: ['./company-profile.component.css'],
})
export class CompanyProfileComponent implements OnInit, OnChanges {
  private isInitialized = false; // Flag to track initialization

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @Input() symbol: string = '';

  ngOnInit(): void {
    console.log('Company Profile component initialized');
    this.isInitialized = true; // Mark component as initialized
    if (this.symbol) {
      this.loadCompanyProfileScript();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Company Profile ngOnChanges called:', changes);

    // Skip script loading during the first change detection cycle
    if (!this.isInitialized) {
      console.log('Component not initialized yet, skipping...');
      return;
    }

    if (!this.symbol) {
      console.warn('No symbol provided for Company Profile widget.');
      return;
    }

    console.log('Loading Company Profile for symbol:', this.symbol);

    const container = this.el.nativeElement.querySelector('.company-profile-widget-container__widget');
    console.log('Container found:', !!container);

    // Check if container exists and has a child
    if (container && container.firstChild) {
      console.log('Removing existing script');
      this.renderer.removeChild(container, container.firstChild);
    }

    this.loadCompanyProfileScript();
  }

  loadCompanyProfileScript(): void {
    console.log('loadCompanyProfileScript called with symbol:', this.symbol);

    const container = this.el.nativeElement.querySelector('.company-profile-widget-container__widget');
    if (!container) {
      console.error('Company Profile container not found!');
      return;
    }

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.async = true;

    const config = {
      height: "100%",
      width: "100%",
      symbol: `${this.symbol}`,
      locale: 'en',
      isTransparent: false,
      colorTheme: 'light',
    };

    console.log('Company Profile config:', config);
    script.text = JSON.stringify(config);

    console.log('Appending Company Profile script to container');
    this.renderer.appendChild(container, script);

    // Add error handling
    script.onerror = (error: any) => {
      console.error('Failed to load Company Profile script:', error);
    };

    script.onload = () => {
      console.log('Company Profile script loaded successfully');
    };
  }
}
