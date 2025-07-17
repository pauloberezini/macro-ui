import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AlphaVantageService } from '../alpha-vantage.service';
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    AsyncPipe,
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;

  constructor(
    private alphaVantageService: AlphaVantageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap(value => this.alphaVantageService.search(value)),
    // );
  }

  // Getter for template binding to improve change detection
  get hasValue(): boolean {
    const value = this.myControl.value;
    const hasVal = !!(value && value.trim());
    console.log('hasValue check:', value, '→', hasVal); // Debug log
    return hasVal;
  }

  // Clear input method for the clear button
  clearInput(): void {
    debugger
    console.log('clearInput called - current value:', this.myControl.value);
    this.myControl.setValue('');
    this.myControl.markAsTouched();
    this.cdr.detectChanges();
    console.log('clearInput completed - new value:', this.myControl.value);
  }

  // Test method to verify click events work
  testClick(): void {
    console.log('TEST CLICK WORKS!');
    alert('Button click is working!');
  }
}
