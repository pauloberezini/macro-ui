import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {filter, Observable, startWith, tap} from "rxjs";
import {debounceTime, distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {StockDataService} from "../services/stock-data.service";
import * as moment from "moment/moment";
import {MatIconModule} from "@angular/material/icon";
import {Chart, registerables} from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";


Chart.register(...registerables, annotationPlugin);
@Component({
  selector: 'app-macro-charts',
  standalone: true,
  imports: [
    FlexModule,
    MatCardModule,
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    NgForOf,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './macro-charts.component.html',
  styleUrl: './macro-charts.component.css'
})
export class MacroChartsComponent implements OnInit {
  currencyControl = new FormControl();
  filteredCurrencies: Observable<string[]>;


  currencies: string[] = ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'CHF', 'NZD', 'CNY', 'IDR', 'HKD', 'BRL', 'MXN', 'KRW', 'ZAR', 'NOK', 'SGD', 'INR'];
  selectedCountry: string = 'USD';

  //chart
  chart: Chart;
  chartData: any[] = [];
  showChart: boolean = false;
  noDataAvailable: boolean = true;
  @ViewChild("atrChart") atrChart: ElementRef;

  ngOnInit(): void {
    this.filteredCurrencies = this.currencyControl.valueChanges.pipe(
      startWith(''),
      switchMap(value =>
        this.service.getNewsTitles(this.selectedCountry).pipe(
          map(response => this._filter(response.data, value))
        )
      )
    );
    this.currencyControl.valueChanges
      .pipe(
        debounceTime(400), // Wait for 400ms pause in events
        distinctUntilChanged(), // Only if the value has changed
        filter(value => value.length > 1) // Only if the value length is greater than 1
      )
      .subscribe(value => {
        this.request(value);
      });
  }


  request(eventName: string) {
    this.service.getDynamicData(this.selectedCountry, eventName).subscribe(response => {
      if (response.success) {
        this.chartData = response.data.map((d: any) => ({
          x: moment(d.time).format('YYYY-MM-DD'),
          y: parseFloat(d.actualInfo)
        }));
        this.noDataAvailable = this.chartData.length === 0;
        this.showChart = this.chartData.length > 0;

        this.createChart(eventName);
      }
    });
  }


  createChart(title: string) {
    if (this.noDataAvailable) {
      // If no data is available, exit the function
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }


    let canvas = this.atrChart.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        datasets: [{
          label: title,
          data: this.chartData,
          borderColor: 'rgb(75, 192, 192)'
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                const index = context[0].dataIndex;
                const value = context[0].dataset.data[index];
                return moment(value).format('MMM YYYY');
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: 'MMM YYYY'
              }
            },
            title: {
              display: false,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: false,
              text: '%'
            }
          }
        }
      }

    });
  }


  constructor(public service: StockDataService) {
  }

  private _filter(currencies: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    return currencies.filter(currency => currency.toLowerCase().includes(filterValue));
  }


}
