import { Component, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AlphaVantageService } from '../alpha-vantage.service';
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    ReactiveFormsModule
  ],
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private alphaVantageService: AlphaVantageService) { }

  ngOnInit() {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap(value => this.alphaVantageService.search(value)),
    // );
  }
}
