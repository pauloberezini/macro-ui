import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="container">
      <h2>404 - Page not found</h2>
    </div>
  `,
  standalone: true,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh; /* Full viewport height */
      text-align: center;
    }

    h2 {
      color: red;
      margin-bottom: 20px;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class NotFoundComponent { }
