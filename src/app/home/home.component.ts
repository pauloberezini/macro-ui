import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {Router} from "@angular/router";
import {AnimatedBackgroundComponent} from "../animated-background/animated-background.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    AnimatedBackgroundComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private originalBodyOverflow: string = '';

  private slides: NodeListOf<HTMLElement>;


  constructor(private router: Router, private elRef: ElementRef,private renderer: Renderer2) {
  }


  testimonials = [
    {
      text: 'The most comprehensive macroeconomic analysis platform we\'ve used...',
      name: 'Sarah Johnson',
      position: 'Chief Economist, Global Bank',
      photo: 'assets/team/sarah.jpg'
    },
    {
      text: 'Revolutionized our research capabilities overnight',
      name: 'Michael Chen',
      position: 'Portfolio Manager, Hedge Fund',
      photo: 'assets/team/michael.jpg'
    }
  ];

  currentStats = {
    countries: 57,
    indicators: 2340,
    updatesDaily: 1200000
  };

  marketingData = {
    users: 500000,
    revenue: 12000000,
    growthRate: 35
  };


  goToLegal() {
    this.router.navigate(['/legal']);
  }

  goToAboutUs() {
    this.router.navigate(['/app-supported-by']);
  }

  goToTerms() {
    this.router.navigate(['/terms']);
  }

  goToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  ngAfterViewInit(): void {
    // Select all elements with an id ending in "-slide"
    this.slides = this.elRef.nativeElement.querySelectorAll('[id$="-slide"]');
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    // Adjust the speed factor to control the animation speed
    const speedFactor = 0.5;
    this.slides.forEach((slide: HTMLElement) => {
      slide.style.backgroundPosition = `center ${-scrollY * speedFactor}px`;
    });
  }

  ngOnInit(): void {
    // Save the current body overflow style
    this.originalBodyOverflow = document.body.style.overflow;
    // Override body overflow to block auto scrolling
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  ngOnDestroy(): void {
    // Restore the original overflow style when the component is destroyed
    this.renderer.setStyle(document.body, 'overflow', this.originalBodyOverflow);
  }
}

