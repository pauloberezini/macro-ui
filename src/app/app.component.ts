import { Component, OnInit, HostListener, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Meta } from '@angular/platform-browser';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { MatDialog } from '@angular/material/dialog';
import { JoinComponent } from './login/join/join.component';
import { AuthService } from './services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  // Reactive state management
  readonly mobileMenuOpen = signal<boolean>(false);
  readonly isLoggedIn = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  
  // Legacy properties for compatibility
  isCollapsed = true;

  constructor(
    private metaTagService: Meta, 
    private dialog: MatDialog, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupMetaTags();
    this.setupAuthStateTracking();
  }

  private setupMetaTags(): void {
    this.metaTagService.addTags([
      {
        name: 'description',
        content: 'Professional financial analysis platform by Berezini Partners. Access real-time market data, economic calendar, insider trading insights, and advanced analytics tools.'
      },
      {
        name: 'keywords',
        content: 'financial analysis, market data, economic calendar, insider trading, stock analysis, Berezini Partners, investment research, trading tools'
      },
      { property: 'og:title', content: 'Berezini Partners | Professional Financial Analysis Platform' },
      {
        property: 'og:description',
        content: 'Advanced financial analysis tools and real-time market insights for professional traders and investors.'
      },
      { property: 'og:url', content: 'https://macro.berezini.com/' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://macro.berezini.com/assets/images/economic-calendar-og-image.png' },
    ]);
  }

  private setupAuthStateTracking(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
    });
  }

  toggleMobileMenu(): void {
    const isOpen = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(isOpen);
    
    // Manage body scroll and focus
    if (isOpen) {
      document.body.classList.add('mobile-menu-open');
      this.focusFirstMenuElement();
    } else {
      document.body.classList.remove('mobile-menu-open');
      this.returnFocusToToggle();
    }
  }

  closeMobileMenuOnOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.toggleMobileMenu();
    }
  }

  private focusFirstMenuElement(): void {
    setTimeout(() => {
      const firstMenuItem = document.querySelector('.mobile-nav-item, .close-btn') as HTMLElement;
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }, 100);
  }

  private returnFocusToToggle(): void {
    setTimeout(() => {
      const toggleButton = document.querySelector('.mobile-toggle') as HTMLElement;
      if (toggleButton) {
        toggleButton.focus();
      }
    }, 100);
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.mobileMenuOpen()) {
      this.toggleMobileMenu();
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.mobileMenuOpen() && event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  async openJoinPopup(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      const dialogRef = this.dialog.open(JoinComponent, {
        width: '400px',
        maxWidth: '90vw',
        panelClass: 'modern-dialog',
        disableClose: false,
        autoFocus: true,
        restoreFocus: true
      });

      const result = await dialogRef.afterClosed().toPromise();
      console.log('Join dialog closed:', result);
    } catch (error) {
      console.error('Error opening join dialog:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      this.authService.logout();
      await this.router.navigate(['/']);
      
      // Close mobile menu if open
      if (this.mobileMenuOpen()) {
        this.mobileMenuOpen.set(false);
        document.body.classList.remove('mobile-menu-open');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async openSignInPopup(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        maxWidth: '90vw',
        panelClass: 'modern-dialog',
        disableClose: false,
        autoFocus: true,
        restoreFocus: true
      });

      const result = await dialogRef.afterClosed().toPromise();
      console.log('Sign In dialog was closed', result);
      
      // Check if user is now logged in and redirect to profile if needed
      if (this.authService.isLoggedIn()) {
        await this.router.navigate(['/app-profile']);
      }
    } catch (error) {
      console.error('Error opening sign in dialog:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Legacy method for compatibility
  toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
