import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

export interface RegistrationDTO {
  name: string;
  surname?: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private url: string = environment.url; // Use the environment variable
  // Update the baseUrl if your backend is hosted somewhere else.
  private baseUrl = this.url + '/api/registration';

  constructor(private http: HttpClient) {
  }

  registerUser(data: RegistrationDTO): Observable<any> {
    // Assuming your backend registration endpoint is /api/registration/register
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' as 'json' });
  }
}
