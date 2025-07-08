import {Component, OnInit, HostListener} from '@angular/core';
import {Meta} from "@angular/platform-browser";
import {SignInComponent} from "./login/sign-in/sign-in.component";
import {MatDialog} from "@angular/material/dialog";
import {JoinComponent} from "./login/join/join.component";
import {AuthService} from "./services/auth.service";
import {Router, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AnimatedBackgroundComponent} from "./animated-background/animated-background.component";

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
    MatIconModule,
    MatSidenavModule,
    NgIf,
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  mobileMenuOpen = false;
  isCollapsed = true;
  isLoggedIn: boolean = false;

  constructor(private metaTagService: Meta, private dialog: MatDialog, private authService: AuthService, private router: Router) {
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    // Manage body scroll when mobile menu is open
    if (this.mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
      // Focus management - focus the close button when menu opens
      setTimeout(() => {
        const closeButton = document.querySelector('.close-button') as HTMLElement;
        if (closeButton) {
          closeButton.focus();
        }
      }, 100);
    } else {
      document.body.classList.remove('mobile-menu-open');
      // Return focus to menu toggle button
      setTimeout(() => {
        const menuToggle = document.querySelector('.mobile-menu-toggle') as HTMLElement;
        if (menuToggle) {
          menuToggle.focus();
        }
      }, 100);
    }
  }

  closeMobileMenuOnOverlay(event: Event): void {
    // Close menu when clicking on overlay background
    if (event.target === event.currentTarget) {
      this.toggleMobileMenu();
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.mobileMenuOpen) {
      this.toggleMobileMenu();
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Trap focus within mobile menu when it's open
    if (this.mobileMenuOpen && (event.key === 'Tab')) {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
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
      // Check if user is now logged in and redirect to profile if needed
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/app-profile']);
      }
    });
  }

  // These methods are no longer needed since we're using routerLink
  // but keeping them commented in case you need them for any special logic
  /*
  goToHome() {
    this.router.navigate(['/']);
  }
  goToEvents() {
    this.router.navigate(['/app-economic-calendar']);
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

  profile() {
    this.router.navigate(['/app-profile']);
  }
  */
}
