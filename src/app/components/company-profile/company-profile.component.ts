import {Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-company-profile',
  template: `
  <div>
    <div class="company-profile-widget-container__widget"></div>
    <div class="tradingview-widget-copyright">
      <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="blue-text">Track all markets on TradingView</span>
      </a>
    </div>
  </div>`,

  standalone: true
})
export class CompanyProfileComponent implements OnInit, OnChanges {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() symbol: string = '';

  ngOnInit(): void {
    this.loadCompanyProfileScript();
  }

  ngOnChanges(_: SimpleChanges): void {
    const container = this.el.nativeElement.querySelector('.company-profile-widget-container__widget');
    this.renderer.removeChild(container, container.firstChild);
    this.loadCompanyProfileScript();
  }

  loadCompanyProfileScript(): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.async = true;
    script.text = JSON.stringify({
      height: "\"100%\"",
      width: "\"100%\"",
      symbol: this.symbol,
      locale: 'en',
      isTransparent: false,
      colorTheme: 'light'
    });

    // Append the script to the widget container
    const container = this.el.nativeElement.querySelector('.company-profile-widget-container__widget');
    this.renderer.appendChild(container, script);
  }
}
