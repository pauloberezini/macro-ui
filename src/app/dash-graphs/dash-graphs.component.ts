import { Component } from '@angular/core';

@Component({
  selector: 'dash-graphs',
  templateUrl: './dash-graphs.component.html',
  styleUrls: ['./dash-graphs.component.css']
})
export class DashGraphsComponent {

  flexItems: string[] = ['Item 1', 'Item 2'];

  addFlexItem(): void {
    const newItem = `Item ${this.flexItems.length + 1}`;
    this.flexItems.push(newItem);
  }
}
