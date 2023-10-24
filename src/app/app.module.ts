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
import {LargeAreaChartComponent} from './yahoo-daily-data/large-area-chart.component';
import {AppRoutingModule} from './app-routing.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {EconomicCalendarComponent} from './economic-calendar/economic-calendar.component';
import {MatIconModule} from '@angular/material/icon';
import {FxCollectionComponent} from './alpha-fx-data/fx-collection.component';
import {StockCollectionComponent} from './apha-stock-data/stock-collection.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ApiInterceptor} from './services/spinner/apiInterceptor';
import {EconomicDataComponent} from './macro-chart/economic-data.component';
import {NewsComponent} from './news-list/news.component';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {WarningDialogComponent} from './warning-dialog/warning-dialog.component';
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
import { DashGraphsComponent } from './dash-graphs/dash-graphs.component';
import { SeasonalityComponent } from './seasonality/seasonality.component';
import { PieAreaComponent } from './pie-area/pie-area.component';


const routes: Routes = [
  {path: '', component: EconomicCalendarComponent},
  {path: 'app-news', component: NewsComponent},
  {path: 'fx-collection', component: FxCollectionComponent},
  {path: 'app-stock-collection', component: StockCollectionComponent},
  {path: 'app-line-chart', component: LineChartComponent},
  {path: 'app-large-area-chart', component: LargeAreaChartComponent},
  {path: 'seasonality', component: MacroContainerComponent},
  {path: 'app-seasonality', component: SeasonalityComponent},
  {path: 'app-supported-by', component: SupportedByComponent},
  {path: 'dash-graphs', component: DashGraphsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    LargeAreaChartComponent,
    EconomicCalendarComponent,
    FxCollectionComponent,
    StockCollectionComponent,
    EconomicDataComponent,
    NewsComponent,
    WarningDialogComponent,
    DateFormatPipe,
    VolatilityPipe,
    TimeFormatPipe,
    TruncatePipe,
    SearchComponent,
    MacroContainerComponent,
    SupportedByComponent,
    DashGraphsComponent,
    SeasonalityComponent,
    PieAreaComponent
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
    MatRadioModule
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
  entryComponents: [
    WarningDialogComponent,
    FxCollectionComponent,
    StockCollectionComponent
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
