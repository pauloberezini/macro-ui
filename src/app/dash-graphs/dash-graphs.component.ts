import {
  Component,
  ComponentFactoryResolver,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {LargeAreaChartComponent} from "../yahoo-daily-data/large-area-chart.component";
import {LineChartComponent} from "../yahoo-monthly-data/line-chart.component";

@Component({
  selector: 'dash-graphs',
  templateUrl: './dash-graphs.component.html',
  styleUrls: ['./dash-graphs.component.css']
})
export class DashGraphsComponent {

  // flexItems: string[] = ['Item 1', 'Item 2'];


  @ViewChildren('target', { read: ViewContainerRef }) targets: QueryList<ViewContainerRef>;
  availableComponents = [
    {name: 'Seasonality pro', component: LineChartComponent},
    {name: 'Daily Seasonality pro', component: LargeAreaChartComponent},
    // ... add other components here ...
  ];

  flexItems: any[] = [
    { selectedComponent: '' }, // Initialize with an empty string or a default value
    { selectedComponent: '' },
    // Add more objects as needed
  ];

  constructor(private componentFactoryResolver: ComponentFactoryResolver, /*... other dependencies... */) {
  }

  // ... other methods ...

  loadComponent(index: number, componentName: string): void {
    const containerRef = this.targets.toArray()[index];
    containerRef.clear();  // Clear any existing content

    const selectedComponent = this.availableComponents.find(comp => comp.name === componentName);
    if (selectedComponent) {
      // @ts-ignore
      const factory = this.componentFactoryResolver.resolveComponentFactory(selectedComponent.component);
      const componentRef = containerRef.createComponent(factory);
    }
  }

  addGraph(): void {
    const newItem = { selectedComponent: '' }; // Initialize with an empty string or a default value
    this.flexItems.push(newItem);
  }

}
