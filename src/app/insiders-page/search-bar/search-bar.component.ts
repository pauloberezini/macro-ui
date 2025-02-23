import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StockDataService } from '../../services/stock-data.service';
import { StockSuggestion } from '../../model/stock-suggestion';
import { MatInputModule } from '@angular/material/input';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

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
  @Output() suggestionSelected = new EventEmitter<string>();

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
    this.suggestionSelected.emit(suggestion.ticker);
    // Optionally update the input with a formatted value
    this.searchControl.setValue(this.nameToDisplay(suggestion), { emitEvent: false });
    // Hide suggestions after selection
    this.showSuggestions = false;
  }

  nameToDisplay(suggestion: StockSuggestion): string {
    return `${suggestion.ticker} (${suggestion.title})`;
  }

  clearInput(): void {
    this.searchControl.setValue('');
    this.showSuggestions = false;
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
}
