import {Component} from '@angular/core';
import {Meta} from "@angular/platform-browser";
import {SignInComponent} from "./sign-in/sign-in.component";
import {MatDialog} from "@angular/material/dialog";

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isCollapsed = true;

  constructor(private metaTagService: Meta, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.metaTagService.addTags([
      {
        name: 'description',
        content: 'Access the latest financial events and economic reports with the Berezini Partners Economic Calendar. Track key market-moving events in real-time.'
      },
      {
        name: 'keywords',
        content: 'economic calendar, financial events, market data, Berezini Partners, financial analysis, trading, forex, stocks, FOMC, unemployment rate, nonfarm payrolls'
      },
      {property: 'og:title', content: 'Economic Calendar | Berezini Partners'},
      {
        property: 'og:description',
        content: 'Stay ahead in the market with Berezini Partners Economic Calendar. In-depth analysis and real-time updates on financial events around the globe.'
      },
      {property: 'og:url', content: 'https://macro.berezini.com/'},
      {property: 'og:type', content: 'website'},
      {property: 'og:image', content: 'https://macro.berezini.com/assets/images/economic-calendar-og-image.png'},
    ]);
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  openSignInPopup(): void {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '400px',  // Adjust the width as needed
      // Optionally, pass data to the component:
      // data: { anyData: 'your data' },
      // Optionally, disable closing by clicking outside:
      // disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Sign In dialog was closed', result);
      // You can handle dialog result here if needed
    });
  }
}
