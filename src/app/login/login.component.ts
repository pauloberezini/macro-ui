import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  chatId: string | null = null;
  userId: string | null = null;
  token: string | null = null;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      filter(params => params['token']),
      map(params => params['token'])
    ).subscribe(token => {
      const parts = token.split('_');
      if (parts.length === 3) {  // Ensure the token format is as expected
        this.chatId = parts[0];
        this.userId = parts[1];
        this.token = parts[2];
      } else {
        console.error('Token format is incorrect.');
      }
    });
  }
}
