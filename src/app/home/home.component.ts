import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {Router, RouterLink} from "@angular/router";
import {AnimatedBackgroundComponent} from "../animated-background/animated-background.component";
import {CommonModule} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {JoinComponent} from "../login/join/join.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    AnimatedBackgroundComponent,
    RouterLink,
    CommonModule
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private originalBodyOverflow: string = '';
  private sliderInterval: any;
  private testimonialInterval: any;

  currentSlide = 0;
  currentTestimonial = 0;

  constructor(private router: Router, private elRef: ElementRef, private renderer: Renderer2, private dialog: MatDialog) {}

  heroSlides = [
    {
      title: 'Macro Economic Insights Platform',
      description: 'Trusted by 850+ financial institutions across 45 countries. Get real-time market insights with 94% forecast accuracy.',
      stats: [
        { number: '1.2M+', label: 'Daily Data Points' },
        { number: '94%', label: 'Forecast Accuracy' }
      ],
      primaryAction: { text: 'Start Free Trial', action: 'openJoin' },
      secondaryAction: { text: 'View Demo', link: '/demo' }
    },
    {
      title: 'AI-Powered Market Analysis',
      description: 'Detect market anomalies before they happen. Our AI analyzes over 1TB of market data to give you the edge.',
      stats: [
        { number: '1+ TB', label: 'Market Data' },
        { number: '24/7', label: 'Real-time Analysis' }
      ],
      primaryAction: { text: 'Explore AI Tools', link: '/app-stock-anomaly' },
      secondaryAction: { text: 'Learn More', link: '/features' }
    },
    {
      title: 'Track Smart Money Moves',
      description: 'Follow insider trades and institutional movements in real-time. See what the pros are doing before the market reacts.',
      stats: [
        { number: '10K+', label: 'Active Users' },
        { number: '$12M+', label: 'Annual Revenue' }
      ],
      primaryAction: { text: 'Track Insiders', link: '/insiders' },
      secondaryAction: { text: 'View Calendar', link: '/app-economic-calendar' }
    }
  ];

  features = [
    {
      icon: 'event_note',
      title: 'Economic Calendar',
      description: 'Track key economic events and high-impact news that move markets.',
      route: '/app-economic-calendar'
    },
    {
      icon: 'trending_up',
      title: 'Seasonality Analysis',
      description: 'Identify predictable market patterns and optimize your trading strategy.',
      route: '/app-seasonality'
    },
    {
      icon: 'insights',
      title: 'AI Anomaly Detection',
      description: 'Detect market disruptions before they impact your portfolio.',
      route: '/app-stock-anomaly'
    },
    {
      icon: 'visibility',
      title: 'Insider Trades',
      description: 'Follow SEC insider transactions and institutional movements.',
      route: '/insiders'
    },
    {
      icon: 'article',
      title: 'Market News',
      description: 'AI-powered sentiment analysis of market-moving news.',
      route: '/app-news'
    },
    {
      icon: 'dashboard',
      title: 'Analytics Dashboard',
      description: 'Comprehensive market data visualization and analysis tools.',
      route: '/dash-graphs'
    }
  ];

  testimonials = [
    {
      quote: 'This platform has revolutionized how we approach macro analysis. The AI-powered insights have helped us identify market opportunities we would have missed otherwise.',
      name: 'Sarah Johnson',
      position: 'Chief Investment Officer',
      company: 'Goldman Sachs'
    },
    {
      quote: 'The economic calendar and insider tracking features are game-changers. We\'ve improved our trading accuracy by 40% since using this platform.',
      name: 'Michael Chen',
      position: 'Portfolio Manager',
      company: 'BlackRock'
    },
    {
      quote: 'The real-time market data and anomaly detection have given us a significant competitive advantage. It\'s like having a crystal ball for the markets.',
      name: 'Emma Rodriguez',
      position: 'Head of Research',
      company: 'JPMorgan Chase'
    },
    {
      quote: 'Outstanding platform with incredible accuracy. The seasonal analysis feature alone has paid for itself multiple times over.',
      name: 'David Kumar',
      position: 'Senior Analyst',
      company: 'Morgan Stanley'
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

  ngOnInit(): void {
    this.originalBodyOverflow = document.body.style.overflow;
    this.startSliderAutoPlay();
    this.startTestimonialAutoPlay();
  }

  ngAfterViewInit(): void {
    // Any additional setup after view initialization
  }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow', this.originalBodyOverflow);
    this.stopSliderAutoPlay();
    this.stopTestimonialAutoPlay();
  }

  // Join/Signup Methods
  openJoinPopup(): void {
    const dialogRef = this.dialog.open(JoinComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Join dialog closed:', result);
      // You can perform additional actions with the result if needed
    });
  }

  // Handle slide actions
  handleSlideAction(slide: any): void {
    if (slide.primaryAction.action === 'openJoin') {
      this.openJoinPopup();
    } else if (slide.primaryAction.link) {
      this.router.navigate([slide.primaryAction.link]);
    }
  }

  // Hero Slider Methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    this.resetSliderAutoPlay();
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.heroSlides.length - 1 : this.currentSlide - 1;
    this.resetSliderAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetSliderAutoPlay();
  }

  private startSliderAutoPlay(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private stopSliderAutoPlay(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  private resetSliderAutoPlay(): void {
    this.stopSliderAutoPlay();
    this.startSliderAutoPlay();
  }

  // Testimonial Slider Methods
  nextTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    this.resetTestimonialAutoPlay();
  }

  previousTestimonial(): void {
    this.currentTestimonial = this.currentTestimonial === 0 ? this.testimonials.length - 1 : this.currentTestimonial - 1;
    this.resetTestimonialAutoPlay();
  }

  goToTestimonial(index: number): void {
    this.currentTestimonial = index;
    this.resetTestimonialAutoPlay();
  }

  private startTestimonialAutoPlay(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 7000); // Change testimonial every 7 seconds
  }

  private stopTestimonialAutoPlay(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  private resetTestimonialAutoPlay(): void {
    this.stopTestimonialAutoPlay();
    this.startTestimonialAutoPlay();
  }

  // Navigation Methods
  goToLegal(): void {
    this.router.navigate(['/legal']);
  }

  goToAboutUs(): void {
    this.router.navigate(['/app-supported-by']);
  }

  goToTerms(): void {
    this.router.navigate(['/terms']);
  }

  goToPrivacyPolicy(): void {
    this.router.navigate(['/privacy-policy']);
  }

  // Pause auto-play when user hovers over sliders
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.hero-slider')) {
      this.stopSliderAutoPlay();
    }
    if (target.closest('.testimonials-slider')) {
      this.stopTestimonialAutoPlay();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.hero-slider')) {
      this.startSliderAutoPlay();
    }
    if (target.closest('.testimonials-slider')) {
      this.startTestimonialAutoPlay();
    }
  }
}

