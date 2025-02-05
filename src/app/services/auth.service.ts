import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = environment.url; // e.g., "http://localhost:8089"
  private baseUrl = `${this.url}/api/login`;

  // BehaviorSubject to track login state
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // New login method accepting a LoginRequest and returning an Observable<LoginResponse>
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, loginRequest).pipe(
      tap((response: LoginResponse) => {
        // Store the token on successful login
        localStorage.setItem('token', response.token);
        // Update the login status
        this.loggedInSubject.next(true);
      })
    );
  }

  // Logout method clears the token and updates the login status
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('lastEmail');
    localStorage.removeItem('lastPassword');
    this.loggedInSubject.next(false);
  }

  // Simple method to check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
