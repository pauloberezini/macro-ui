import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {StockDataService} from "../../services/stock-data.service";
import {StockSuggestion} from "../../model/stock-suggestion";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchControl = new FormControl('');
  suggestions: StockSuggestion[] = [];
  @Output() suggestionSelected = new EventEmitter<string>();
  showNoResults: boolean = false;
  constructor(private service: StockDataService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after the user stops typing
        distinctUntilChanged(), // Only trigger if the value has changed
        switchMap((query) => this.fetchSuggestions(query))
      )
      .subscribe((suggestions) => {
        this.suggestions = suggestions;
        if (suggestions.length === 0) {
          this.showNoResults = true;
        }
        else
        {
          this.showNoResults = false;
        }
      })
    ;
  }

  fetchSuggestions(query: string): Observable<StockSuggestion[]> {
    if (!query.trim()) {
      return of([]); // Return an empty array if the query is empty
    }

    return this.service.suggest(query);
  }

  onSuggestionClick(suggestion: StockSuggestion): void {
    this.suggestionSelected.emit(suggestion.ticker);
    this.suggestions = [];
    this.searchControl.setValue(this.nameToDisplay(suggestion), { emitEvent: false });
  }

   nameToDisplay(suggestion: StockSuggestion) : string {
    return suggestion.ticker + " (" + suggestion.title + ")";
  }

  clearInput(): void {
    this.searchControl.setValue('', { emitEvent: false }); // Clear the input
    this.suggestions = []; // Clear the suggestions
  }
}
