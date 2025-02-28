import { Component } from '@angular/core';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule,
    MatCardModule
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {
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
}
