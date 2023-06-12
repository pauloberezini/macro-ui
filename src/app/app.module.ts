import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppComponent } from './app.component';
import { LineChartComponent } from './yahoo-monthly-data/line-chart.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { LargeAreaChartComponent } from './yahoo-daily-data/large-area-chart.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NewsCollectionComponent } from './news-macro-data/news-collection.component';
import { MatIconModule } from '@angular/material/icon';
import { FxCollectionComponent } from './alpha-fx-data/fx-collection.component';
import { StockCollectionComponent } from './apha-stock-data/stock-collection.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiInterceptor } from './services/spinner/apiInterceptor';
import { EconomicDataComponent } from './macro-chart/economic-data.component';
import { NewsComponent } from './news-list/news.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DateFormatPipe } from './model/date-format-pipe';
import { TruncatePipe } from './model/truncate-pipe';


@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    LargeAreaChartComponent,
    NewsCollectionComponent,
    FxCollectionComponent,
    StockCollectionComponent,
    EconomicDataComponent,
    NewsComponent,
    WarningDialogComponent,
    DateFormatPipe ,
    TruncatePipe
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
    MatDialogModule
  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule
  ],
  entryComponents: [
    WarningDialogComponent,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
