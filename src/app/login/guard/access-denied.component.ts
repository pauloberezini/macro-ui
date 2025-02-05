import { Component } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  template: `
    <div class="access-denied-container">
      <h1>Access Denied</h1>
      <p>You must be registered and signed in to view this content.</p>
      <p>Sign In or Register</p>
    </div>
  `,
  standalone: true,
  styles: [`
    .access-denied-container {
      text-align: center;
      margin-top: 100px;
    }
  `]
})
export class AccessDeniedComponent { }
