import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader" *ngIf="isLoading">
      <!-- Your loader HTML structure here -->
    </div>
  `,
  standalone: true,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  isLoading: boolean = false;

  // Add methods to control the value of `isLoading`
}
