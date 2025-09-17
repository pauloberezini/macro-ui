import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChartHelpContent } from '../../interfaces/chart-help.interface';

@Component({
  selector: 'app-chart-help-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="help-dialog">
      <header class="help-header">
        <h2 mat-dialog-title>Chart Information</h2>
        <button 
          mat-icon-button 
          [mat-dialog-close]
          aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <mat-dialog-content>
        <div class="help-sections">
          @for (section of helpContent.sections; track section.title) {
            <section class="help-section">
              <div class="section-header">
                @if (section.icon) {
                  <mat-icon>{{ section.icon }}</mat-icon>
                }
                <h3>{{ section.title }}</h3>
              </div>
              <p>{{ section.content }}</p>
            </section>
          }
        </div>

        <footer class="help-footer">
          <small>Last updated: {{ helpContent.lastUpdated | date:'mediumDate' }}</small>
        </footer>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button 
          mat-button 
          [mat-dialog-close]
          class="btn-simple">
          Close
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .help-dialog {
      padding: 0;
      max-width: 600px;
      width: 100%;
    }

    .help-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-light);
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .help-sections {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .help-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .section-header mat-icon {
      color: var(--accent-teal);
    }

    p {
      margin: 0;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .help-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border-light);
      color: var(--text-secondary);
    }

    mat-dialog-actions {
      padding: 8px 24px 24px;
      margin: 0;
    }
  `]
})
export class ChartHelpDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ChartHelpDialogComponent>);

  readonly helpContent: ChartHelpContent = {
    sections: [
      {
        title: 'Chart Types',
        icon: 'insert_chart',
        content: 'Choose between Regular, Pre-Election, Election, and Post-Election periods to analyze market behavior during different electoral cycles.'
      },
      {
        title: 'Symbol Selection',
        icon: 'search',
        content: 'Enter a stock symbol directly or use the search bar to find companies. The chart will update automatically when you select a new symbol.'
      },
      {
        title: 'Data Analysis',
        icon: 'analytics',
        content: 'The chart displays seasonal patterns based on historical data. Green areas indicate historically positive periods, while red areas show negative trends.'
      },
      {
        title: 'Time Periods',
        icon: 'date_range',
        content: 'Data is analyzed across multiple years to identify recurring patterns. The analysis excludes years with insufficient data to ensure accuracy.'
      }
    ],
    lastUpdated: new Date('2024-03-15')
  };
}
