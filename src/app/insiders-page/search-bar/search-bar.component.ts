import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StockDataService } from '../../services/stock-data.service';
import { StockSuggestion } from '../../model/stock-suggestion';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    AsyncPipe
  ],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchControl = new FormControl('');
  suggestions$: Observable<StockSuggestion[]> = of([]);

  @Output() suggestionSelected = new EventEmitter<StockSuggestion>();
  @Input() clearOnDropdown: boolean = false; // Receive the clearOnDropdown flag from parent

  // Flag to control visibility of suggestions list
  showSuggestions = false;

  constructor(private service: StockDataService) {}

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.fetchSuggestions(query))
    );
  }

  fetchSuggestions(query: string): Observable<StockSuggestion[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return of([]); // Return an empty array if the query is empty
    }
    return this.service.suggest(trimmed);
  }

  onSuggestionClick(suggestion: StockSuggestion): void {
    // Emit the selected ticker
    this.suggestionSelected.emit(suggestion);

    // Optionally update the input with a formatted value
    this.searchControl.setValue(this.nameToDisplay(suggestion), { emitEvent: false });
    // Hide suggestions after selection
    this.showSuggestions = false;
  }

  // Emit the current input value as a suggestion on Enter or blur
  onEnterOrBlur(): void {
    const value = this.searchControl.value?.trim();
    if (value) {
      // Extract clean ticker from input (handle cases like "NVDA (NVIDIA CORP)")
      const cleanTicker = this.extractCleanTicker(value);

      // Emit as a StockSuggestion-like object with clean ticker
      this.suggestionSelected.emit({
        cik: "",
        id: 0,
        ticker: cleanTicker,
        title: value
      });
      this.showSuggestions = false;
    }
  }

  // Helper method to extract clean ticker symbol
  private extractCleanTicker(input: string): string {
    if (!input) return '';

    // If input contains parentheses (like "NVDA (NVIDIA CORP)"), extract just the ticker part
    const match = input.match(/^([A-Z0-9._-]+)(?:\s*\(.*\))?$/);
    return match ? match[1] : input.trim().toUpperCase();
  }

  nameToDisplay(suggestion: StockSuggestion): string {
    return `${suggestion.ticker} (${suggestion.title})`;
  }

  clearInput(): void {
    // Clear the input field only if clearOnDropdown is true
    // if (this.clearOnDropdown) {
      this.searchControl.setValue('');
      this.showSuggestions = false;
    // }
  }

  onFocus(): void {
    this.showSuggestions = true;
  }

  onBlur(): void {
    // Use a short timeout to allow a mousedown event on a suggestion to register before hiding the list
    setTimeout(() => (this.showSuggestions = false), 200);
  }

  trackByTicker(index: number, suggestion: StockSuggestion): string {
    return suggestion.ticker;
  }

  ngOnChanges() {
    // If the flag is set, clear the input
    if (this.clearOnDropdown) {
      this.clearInput();
    }
  }
}
