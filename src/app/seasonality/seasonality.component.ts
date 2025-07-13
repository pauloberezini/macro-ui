import {ChangeDetectorRef, Component, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {SeasonalityPro} from "../yahoo-monthly-data/seasonality-pro.component";
import {PieAreaComponent} from "../pie-area/pie-area.component";
import {ChartYearComponentComponent} from "../chart-year-component/chart-year-component.component";
import {Meta} from "@angular/platform-browser";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {BehaviorSubject} from 'rxjs';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-seasonality',
  templateUrl: './seasonality.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ChartYearComponentComponent,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  styleUrls: ['./seasonality.component.css']
})
export class SeasonalityComponent implements OnInit {
  @ViewChild('dynamicInsert', {read: ViewContainerRef}) dynamicInsert!: ViewContainerRef;
  @ViewChild(ChartYearComponentComponent) chartComponent!: ChartYearComponentComponent;

  // Loading states
  private loadingSubject = new BehaviorSubject<boolean>(true); // Start with loading true
  isLoading$ = this.loadingSubject.asObservable();

  // Component states
  selectedStockSymbol: string = 'SP500';
  searchBarSymbol: string | null = null;
  hasDynamicContent: boolean = false;
  errorMessage: string | null = null;
  valueChanged: string | null = null;

  constructor(
    private metaTagService: Meta,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit() {
    this.setupMetaTags();

    // Set initial loading state
    this.loadingSubject.next(true);

    // Simulate initial data load delay
    setTimeout(() => {
      this.loadingSubject.next(false);
      this.cdRef.detectChanges();
    }, 1000); // Short delay to ensure components are ready
  }

  private setupMetaTags() {
    this.metaTagService.addTags([
      {
        name: 'description',
        content: 'Explore historical market trends with Berezini Partners\' Seasonal Trading Pattern Analytics. Uncover patterns and make informed trading decisions based on SP500 historical seasonality.'
      },
      {
        name: 'keywords',
        content: 'seasonality analysis, market trends, historical trading patterns, SP500 seasonality, trading insights, Berezini Partners, stock market analysis, trading strategies'
      },
      {property: 'og:title', content: 'Seasonal Trading Pattern Analytics | Berezini Partners'},
      {
        property: 'og:description',
        content: 'Dive into SP500 historical seasonality and trading patterns. Berezini Partners offers advanced analytics to spot trends and strategize your trades.'
      },
      {property: 'og:url', content: 'https://macro.berezini.com/app-seasonality'},
      {property: 'og:type', content: 'website'},
      {property: 'og:image', content: 'https://macro.berezini.com/assets/images/seasonality-analysis-og-image.png'},
    ]);
  }

  // Unified symbol change handler
  onSymbolChanged(symbol: string) {
    if (symbol && symbol !== this.selectedStockSymbol) {
      this.selectedStockSymbol = symbol;
      // Place your custom logic here (analytics, logging, etc.)
      this.handleValueChangedInternal(symbol);
    }
  }

  // Internal method to avoid recursion
  private handleValueChangedInternal(symbol: string) {
    // This is the original handleValueChanged logic
    this.loadDynamicContent().then(r => {
      this.cdRef.detectChanges();
    });
  }

  private async loadDynamicContent() {
    if (this.loadingSubject.value) return;

    this.loadingSubject.next(true);
    this.errorMessage = null;

    try {
      if (this.dynamicInsert) {
        this.dynamicInsert.clear();
        this.hasDynamicContent = false;
      }

      const componentMap: Record<string, () => Promise<Type<any>>> = {
        'GAS': () => import('../dynamic-component/gas/gas.component').then(m => m.GasComponent),
        // Add other mappings as needed
      };
      if (componentMap[this.selectedStockSymbol]) {
        const component = await componentMap[this.selectedStockSymbol]();
        const componentRef = this.dynamicInsert.createComponent(component);
        this.hasDynamicContent = true;
      }
    } catch (error) {
      console.error('Error loading dynamic component:', error);
      this.errorMessage = 'Failed to load analysis data. Please try again.';
    } finally {
      // Short delay to ensure smooth loading state transition
      setTimeout(() => {
        this.loadingSubject.next(false);
        this.cdRef.detectChanges();
      }, 300);
    }
  }

  getCurrentMonthName(): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  }

  refreshData() {
    if (this.chartComponent) {
      this.chartComponent.getData('refresh');
    }
  }

  // Handler for search bar suggestion
  onSearchBarSuggestion(suggestion: any) {
    debugger
    const symbol = suggestion?.ticker || suggestion || null;
    this.onSymbolChanged(symbol);
  }

  handleValueChanged(symbol: string) {
    console.log('Got valueChanged event:', symbol);
    this.valueChanged = symbol;
    this.onSymbolChanged(symbol);
  }

}
