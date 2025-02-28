import { Component } from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    MatCardModule
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
}
