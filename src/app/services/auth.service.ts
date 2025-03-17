import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from "../../environments/environment";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.url}/api/login`;
  private resetPassUrl = `${environment.url}/api/password-reset`;

  // BehaviorSubject to track login state
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** 🔹 User Login */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, loginRequest).pipe(
      tap((response: LoginResponse) => {
        // Update the login status
        this.loggedInSubject.next(true);
      })
    );
  }

  /** 🔹 Logout: Clear stored token and user data */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('lastEmail');
    localStorage.removeItem('lastPassword');
    this.loggedInSubject.next(false);
  }

  /** 🔹 Check if user is logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** 🔹 Request password reset link (sends email) */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.resetPassUrl}/request`, { email }, { responseType: 'text' });
  }


  /** 🔹 Confirm password reset with token */
  confirmResetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.resetPassUrl}/confirm?token=${token}`, { newPassword }, { responseType: 'text' });
  }
}
