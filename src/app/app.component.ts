import {Component, OnInit} from '@angular/core';
import {Meta} from "@angular/platform-browser";
import {SignInComponent} from "./login/sign-in/sign-in.component";
import {MatDialog} from "@angular/material/dialog";
import {JoinComponent} from "./login/join/join.component";
import {AuthService} from "./services/auth.service";
import {Router, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

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
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule
  ],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isCollapsed = true;
  isLoggedIn: boolean = false;

  constructor(private metaTagService: Meta, private dialog: MatDialog, private authService: AuthService, private router: Router) {
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
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  openJoinPopup(): void {
    const dialogRef = this.dialog.open(JoinComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Join dialog closed:', result);
      // You can perform additional actions with the result if needed
    });
  }

  logout(): void {
    this.authService.logout();
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

  goToHome() {
    this.router.navigate(['/']);
  }

  goToSeasonality() {
    this.router.navigate(['/app-seasonality']);
  }

  goToStockAnomaly() {
    this.router.navigate(['/app-stock-anomaly']);
  }

  goToInsiders() {
    this.router.navigate(['/insiders']);
  }

  goToNews() {
    this.router.navigate(['/app-news']);
  }

  goToDashGraphs() {
    this.router.navigate(['/dash-graphs']);
  }

  goToAbout() {
    this.router.navigate(['/app-supported-by']);
  }
}
