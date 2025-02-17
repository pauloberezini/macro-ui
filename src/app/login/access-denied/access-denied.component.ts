// access-denied.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  styles: [`
    .access-denied-container {
      text-align: center;
      margin-top: 100px;
    }
  `]
})
export class AccessDeniedComponent implements OnInit {
  infoMessage: string = 'You must register or sign in to view this content.';
  returnUrl: string = '/';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.infoMessage = params['message'];
      }
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  goToSignIn(): void {
    // Navigate to sign in and pass along the returnUrl as a query parameter
    this.router.navigate(['/sign-in'], { queryParams: { returnUrl: this.returnUrl } });
  }
}
