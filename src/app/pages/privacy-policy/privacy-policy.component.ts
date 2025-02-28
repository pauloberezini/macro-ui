import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  standalone: true,
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  // Set dynamically to the current date, or replace with a fixed date if needed.
  lastUpdated: string = new Date().toLocaleDateString();
  email: string = 'paulo.berezini@gmail.com';

  constructor() {
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }
}
