import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AiProfileService, AiProfileData } from '../../services/ai-profile.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile-ai-info',
  templateUrl: './profile-ai-info.component.html',
  styleUrls: ['./profile-ai-info.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileAiInfoComponent implements OnInit {
  aiData: AiProfileData | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private aiProfileService: AiProfileService) {}

  ngOnInit() {
    this.loadAiProfile();
  }

  loadAiProfile() {
    this.isLoading = true;
    this.error = null;

    this.aiProfileService.getUserAiProfile()
      .pipe(
        catchError(err => {
          this.error = 'Failed to load AI profile data. Please try again later.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        if (data) {
          this.aiData = data;
        }
      });
  }

  refreshProfile() {
    this.isLoading = true;
    this.error = null;

    this.aiProfileService.refreshAiProfile()
      .pipe(
        catchError(err => {
          this.error = 'Failed to refresh AI profile data. Please try again later.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        if (data) {
          this.aiData = data;
        }
      });
  }
}
