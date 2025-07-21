import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AiProfileData {
  summary: string;
  tradingStyle: string;
  riskLevel: string;
  preferredMarkets: string[];
  topPerformingTrades: {
    symbol: string;
    returnPercentage: number;
    date: string;
  }[];
  tradingFrequency: string;
  lastUpdated: string;
}

export interface UserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiProfileService {
  private baseUrl = `${environment.url}/api/ai-profile`;

  constructor(private http: HttpClient) {}

  /** 🔹 Get current user information */
  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/user`);
  }

  /** 🔹 Get AI profile data for the current user */
  getUserAiProfile(): Observable<AiProfileData> {
    return this.http.get<AiProfileData>(`${this.baseUrl}/profile`);
  }

  /** 🔹 Request AI profile data refresh */
  refreshAiProfile(): Observable<AiProfileData> {
    return this.http.post<AiProfileData>(`${this.baseUrl}/refresh`, {});
  }
} 