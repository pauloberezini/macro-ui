import {
  Component,
  ComponentFactoryResolver,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {SeasonalityPro} from "../yahoo-monthly-data/seasonality-pro.component";
import {Meta} from "@angular/platform-browser";
import {MacroChartsComponent} from "../macro-charts/macro-charts.component";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'dash-graphs',
  templateUrl: './dash-graphs.component.html',
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    NgForOf
  ],
  styleUrls: ['./dash-graphs.component.css']
})
export class DashGraphsComponent {
  @ViewChildren('target', {read: ViewContainerRef}) targets: QueryList<ViewContainerRef>;
  availableComponents = [
    {name: 'Seasonality pro', component: SeasonalityPro},
    {name: 'Economic Indicators', component: MacroChartsComponent},
    // {name: 'Daily Seasonality pro', component: LargeAreaChartComponent},
  ];

  constructor(private metaTagService: Meta, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.metaTagService.addTags([
      {
        name: 'description',
        content: 'Visualize market trends and analyze financial data with Berezini Partners’ Dashboard macro data graphs. Access comprehensive market seasonality and performance data.'
      },
      {
        name: 'keywords',
        content: 'financial data, market trends, macro data graphs, financial visualization, market analysis, Berezini Partners, seasonality charts, stock market data'
      },
      {property: 'og:title', content: 'Market Trends Visualization | Berezini Partners'},
      {
        property: 'og:description',
        content: 'Explore interactive graphs and visualize financial market data to gain insights into seasonality and market trends with Berezini Partners.'
      },
      {property: 'og:url', content: 'https://macro.berezini.com/dash-graphs'},
      {property: 'og:type', content: 'website'},
      {property: 'og:image', content: 'https://macro.berezini.com/assets/images/macro-data-graphs-og-image.png'},
    ]);
  }

  flexItems: any[] = [
    {selectedComponent: ''}
  ];


  loadComponent(index: number, componentName: string): void {
    const containerRef = this.targets.toArray()[index];
    containerRef.clear();
    const selectedComponent = this.availableComponents.find(comp => comp.name === componentName);
    if (selectedComponent) {
      // @ts-ignore
      const factory = this.componentFactoryResolver.resolveComponentFactory(selectedComponent.component);
      const componentRef = containerRef.createComponent(factory);
    }
  }

  addGraph(): void {
    const newItem = {selectedComponent: ''};
    this.flexItems.push(newItem);
  }
  cleanAll(): void {
    this.targets.forEach(target => target.clear());
    this.flexItems = [];
    this.addGraph();
  }

}
