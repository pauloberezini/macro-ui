import { Component, OnInit, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatTable,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgForOf, TitleCasePipe, NgIf } from '@angular/common';
import { finalize, catchError } from 'rxjs/operators';
import { of, EMPTY, forkJoin } from 'rxjs';

import { StockSuggestion } from '../../model/stock-suggestion';
import { UserFavoritesService } from '../../services/user.favorites.service';
import { SearchBarComponent } from '../../insiders-page/search-bar/search-bar.component';
import { ProfileAiInfoComponent } from '../profile-ai-info/profile-ai-info.component';
import { CamelCasePipe } from '../../model/truncate-pipe';
import { AiProfileService, UserInfo } from '../../services/ai-profile.service';

interface DeleteConfirmDialogData {
  stockTitle: string;
  stockTicker: string;
}

@Component({
  selector: 'app-profile',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatButton,
    MatIconButton,
    MatProgressSpinner,
    MatTooltip,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    NgIf,
    SearchBarComponent,
    ProfileAiInfoComponent
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly userFavoritesService = inject(UserFavoritesService);
  private readonly aiProfileService = inject(AiProfileService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Signals for reactive state management
  readonly favoriteStocks = signal<StockSuggestion[]>([]);
  readonly userInfo = signal<UserInfo | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isUserLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);
  readonly hasUserError = signal<boolean>(false);
  readonly clearOnDropdown = signal<boolean>(false);

  // Computed values
  readonly tableStocks = computed(() =>
    this.favoriteStocks().map((stock, index) => ({
      ...stock,
      position: index + 1
    }))
  );

  readonly hasNoFavorites = computed(() =>
    this.favoriteStocks().length === 0 && !this.isLoading()
  );

  readonly userDisplayName = computed(() => {
    const user = this.userInfo();
    if (!user) return 'My Profile';
    return user.fullName || `${user.name} ${user.surname}`.trim() || user.name || 'My Profile';
  });

  readonly displayedColumns: readonly string[] = [
    'position',
    'title',
    'ticker'
  ] as const;

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadFavoriteStocks();
  }

  loadUserInfo(): void {
    this.isUserLoading.set(true);
    this.hasUserError.set(false);

    this.aiProfileService.getCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error loading user information:', error);
          this.hasUserError.set(true);
          return of(null);
        }),
        finalize(() => this.isUserLoading.set(false))
      )
      .subscribe((userInfo) => {
        if (userInfo) {
          this.userInfo.set(userInfo);
        }
      });
  }

  loadFavoriteStocks(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.userFavoritesService.getUserFavoriteStocks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error loading favorite stocks:', error);
          this.hasError.set(true);
          this.showErrorMessage('Failed to load favorite stocks. Please try again.');
          return of([]);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((stocks) => {
        this.favoriteStocks.set(stocks);
      });
  }

  addFavoriteStock(suggestion: StockSuggestion): void {
    if (!suggestion) return;

    this.userFavoritesService.addUserFavoriteStock(suggestion)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error adding favorite stock:', error);
          this.showErrorMessage('Failed to add stock to favorites. Please try again.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.loadFavoriteStocks();
        this.showSuccessMessage(`${suggestion.title} added to favorites`);
      });
  }

  removeFavoriteStock(stock: StockSuggestion): void {
    if (!stock) return;

    // Show confirmation dialog
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { stockTitle: stock.title, stockTicker: stock.ticker },
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.performRemoveFavoriteStock(stock);
        }
      });
  }

  private performRemoveFavoriteStock(stock: StockSuggestion): void {
    this.userFavoritesService.removeUserFavoriteStock(stock)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error removing favorite stock:', error);
          this.showErrorMessage('Failed to remove stock from favorites. Please try again.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.favoriteStocks.update(stocks =>
          stocks.filter(s => s.ticker !== stock.ticker)
        );
        this.showSuccessMessage(`${stock.title} removed from favorites`);
      });
  }

  trackByStock(index: number, stock: StockSuggestion): string {
    return stock.ticker;
  }

  retryLoad(): void {
    this.loadFavoriteStocks();
  }

  retryUserLoad(): void {
    this.loadUserInfo();
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}

// Delete Confirmation Dialog Component
@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="warning-icon">warning</mat-icon>
        Remove from Favorites
      </h2>
      <mat-dialog-content class="dialog-content">
        <p>Are you sure you want to remove <strong>{{data.stockTitle}}</strong> ({{data.stockTicker}}) from your favorites?</p>
        <p class="dialog-subtitle">This action cannot be undone.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          Cancel
        </button>
        <button mat-flat-button (click)="onConfirm()" class="confirm-button">
          <mat-icon>delete</mat-icon>
          Remove
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 8px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .warning-icon {
      color: var(--warning);
    }

    .dialog-content {
      margin-bottom: 16px;
    }

    .dialog-subtitle {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 8px;
    }

    .dialog-actions {
      gap: 8px;
    }

    .cancel-button {
      color: var(--text-secondary);
    }

    .confirm-button {
      background-color: var(--error);
      color: white;
    }

    .confirm-button:hover {
      background-color: var(--error);
      opacity: 0.9;
    }
  `],
  imports: [MatButton, MatIcon, MatDialogTitle, MatDialogContent, MatDialogActions],
  standalone: true
})
export class DeleteConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmDialogData,
    private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
