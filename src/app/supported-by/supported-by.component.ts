import {Component} from '@angular/core';
import {Meta} from "@angular/platform-browser";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-supported-by',
  templateUrl: './supported-by.component.html',
  standalone: true,
  imports: [
    MatCardModule
  ],
  styleUrls: ['./supported-by.component.css']
})
export class SupportedByComponent {

  constructor(private metaTagService: Meta) {
  }

  ngOnInit() {
    this.metaTagService.addTags([
      { name: 'keywords', content: 'About us, Company, Business, Team' },
      { name: 'description', content: 'Learn more about our company, our values, and our team.' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Market Trends Visualization | Berezini Partners' },
      { property: 'og:description', content: 'Explore interactive graphs and visualize financial market data to gain insights into seasonality and market trends with Berezini Partners.' },
      { property: 'og:url', content: 'https://macro.berezini.com/app-supported-by' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://macro.berezini.com/assets/images/macro-data-supported-by-og-image.png' },
    ]);
  }
}
