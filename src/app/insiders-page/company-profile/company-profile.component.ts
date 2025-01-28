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

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() symbol: string = '';

  ngOnInit(): void {
    this.isInitialized = true; // Mark component as initialized
    this.loadCompanyProfileScript();
  }

  ngOnChanges(_: SimpleChanges): void {
    // Skip script loading during the first change detection cycle
    if (!this.isInitialized) {
      return;
    }

    const container = this.el.nativeElement.querySelector('.company-profile-widget-container__widget');

    // Check if container exists and has a child
    if (container && container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }

    this.loadCompanyProfileScript();
  }

  loadCompanyProfileScript(): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.async = true;
    script.text = JSON.stringify({
      height: "100%",
      width: "100%",
      symbol: `${this.symbol}`,
      locale: 'en',
      isTransparent: false,
      colorTheme: 'light',
    });

    // Append the script to the widget container
    const container = this.el.nativeElement.querySelector('.company-profile-widget-container__widget');
    this.renderer.appendChild(container, script);
  }
}
