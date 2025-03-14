import {ApplicationRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import {AppComponent} from './app.component';
import {SeasonalityPro} from './yahoo-monthly-data/seasonality-pro.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatNativeDateModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {AppRoutingModule} from './app-routing.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {EconomicCalendarComponent} from './economic-calendar/economic-calendar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {DateFormatPipe} from './model/date-format-pipe';
import {CamelCasePipe} from './model/truncate-pipe';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule, Routes} from '@angular/router';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MacroChartsComponent} from "./macro-charts/macro-charts.component";
import {PieChartComponent} from "./pie-chart/pie-chart.component";
import {DataMessageComponent} from "./util/data-message/data-message.component";
import {SentimentLineChartComponent} from "./sentiment-line-chart/sentiment-line-chart.component";
import {TradingViewChartComponent} from "./insiders-page/chart/trading-view-chart.component";
import {CompanyProfileComponent} from "./insiders-page/company-profile/company-profile.component";
import {FundamentalDataComponent} from "./insiders-page/fundamental-data/fundamental-data.component";
import {SignInComponent} from "./login/sign-in/sign-in.component";
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    MatDividerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatGridListModule,
    CommonModule,
    MatSelectModule,
    MatTabsModule,
    AppRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    MatSidenavModule,
    AppRoutingModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatCheckboxModule,
    CommonModule,
    MacroChartsComponent,
    PieChartComponent,
    DataMessageComponent,
    SentimentLineChartComponent,
    CamelCasePipe,
    TradingViewChartComponent,
    CompanyProfileComponent,
    FundamentalDataComponent,
    SignInComponent,
    PlotlyModule
  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule,
    MatSidenavModule,
    RouterModule
  ],
  providers: [
    DateFormatPipe
  ]
})
export class AppModule {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
  }
}
