import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms'; // Import FormsModule
import {AppComponent} from './app.component';
import {LineChartComponent} from './yahoo-monthly-data/line-chart.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {AppRoutingModule} from './app-routing.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {EconomicCalendarComponent} from './economic-calendar/economic-calendar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ApiInterceptor} from './services/spinner/apiInterceptor';
import {EconomicDataComponent} from './macro-chart/economic-data.component';
import {NewsComponent} from './news-list/news.component';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {DateFormatPipe} from './model/date-format-pipe';
import {TruncatePipe} from './model/truncate-pipe';
import {TimeFormatPipe} from './model/time-format.pipe';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MacroContainerComponent} from './macro-container/macro-container.component';
import {SupportedByComponent} from './supported-by/supported-by.component';
import {MatRadioModule} from "@angular/material/radio";
import {VolatilityPipe} from "./model/volatility.pipe";
import {DashGraphsComponent} from './dash-graphs/dash-graphs.component';
import {SeasonalityComponent} from './seasonality/seasonality.component';
import {PieAreaComponent} from './pie-area/pie-area.component';
import {ChartYearComponentComponent} from './chart-year-component/chart-year-component.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FlexLayoutModule} from "@angular/flex-layout";
import {HockeyBetComponent} from './hockey-bet/hockey-bet.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TeamCardComponent} from './hockey-bet/team-card/team-card.component';
import {MacroChartsComponent} from "./macro-charts/macro-charts.component";
import {PieChartComponent} from "./pie-chart/pie-chart.component";


const routes: Routes = [
  {path: '', component: EconomicCalendarComponent},
  {path: 'app-news', component: NewsComponent},
  {path: 'app-line-chart', component: LineChartComponent},
  {path: 'seasonality', component: MacroContainerComponent},
  {path: 'app-seasonality', component: SeasonalityComponent},
  {path: 'app-chart-year-component', component: ChartYearComponentComponent},
  {path: 'app-supported-by', component: SupportedByComponent},
  {path: 'dash-graphs', component: DashGraphsComponent},
  {path: 'hockey-bet', component: HockeyBetComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    EconomicCalendarComponent,
    EconomicDataComponent,
    NewsComponent,
    DateFormatPipe,
    VolatilityPipe,
    TimeFormatPipe,
    TruncatePipe,
    SearchComponent,
    MacroContainerComponent,
    SupportedByComponent,
    DashGraphsComponent,
    SeasonalityComponent,
    PieAreaComponent,
    ChartYearComponentComponent,
    HockeyBetComponent,
    TeamCardComponent
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
    RouterModule.forRoot(routes),
    MatAutocompleteModule,
    MatSortModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatCheckboxModule,
    CommonModule,
    MacroChartsComponent,
    PieChartComponent
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
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
