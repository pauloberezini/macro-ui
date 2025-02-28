import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  standalone: true,
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  // Dynamically set the last updated date. You can replace this with a fixed date if needed.
  lastUpdated: string = new Date().toLocaleDateString();
  email: string = 'paulo.berezini@gmail.com';

  constructor() { }

  ngOnInit(): void {
    // Initialization logic if needed
  }
}
