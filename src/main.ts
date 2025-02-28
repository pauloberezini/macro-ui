import { bootstrapApplication } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { EconomicCalendarComponent } from "./app/economic-calendar/economic-calendar.component";
import { NewsComponent } from "./app/news-list/news.component";
import { SeasonalityPro } from "./app/yahoo-monthly-data/seasonality-pro.component";
import { MacroContainerComponent } from "./app/macro-container/macro-container.component";
import { SeasonalityComponent } from "./app/seasonality/seasonality.component";
import { ChartYearComponentComponent } from "./app/chart-year-component/chart-year-component.component";
import { SupportedByComponent } from "./app/supported-by/supported-by.component";
import { InsidersComponent } from "./app/insiders-page/page/insiders.component";
import { DashGraphsComponent } from "./app/dash-graphs/dash-graphs.component";
import { GasComponent } from "./app/dynamic-component/gas/gas.component";
import { ResetPasswordComponent } from "./app/login/reset-password/reset-password.component";
import { HockeyBetComponent } from "./app/hockey-bet/hockey-bet.component";
import {jwtInterceptor} from "./app/login/interceptors/jwt.interceptor";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {StockAnomalyComponent} from "./app/stock-anomaly/stock-anomaly.component";
import {apiInterceptor} from "./app/services/spinner/apiInterceptor";
import {HomeComponent} from "./app/home/home.component";
import {LegalComponent} from "./app/pages/legal/legal.component";
import {TermsComponent} from "./app/pages/terms/terms.component";
import {PrivacyPolicyComponent} from "./app/pages/privacy-policy/privacy-policy.component";

const routes: Routes = [
  { path: 'app-economic-calendar', component: EconomicCalendarComponent },
  { path: 'app-news', component: NewsComponent },
  { path: 'app-line-chart', component: SeasonalityPro },
  { path: 'seasonality', component: MacroContainerComponent },
  { path: 'app-seasonality', component: SeasonalityComponent },
  { path: 'app-chart-year-component', component: ChartYearComponentComponent },
  { path: 'app-supported-by', component: SupportedByComponent },
  { path: 'insiders', component: InsidersComponent },
  { path: 'dash-graphs', component: DashGraphsComponent },
  { path: 'app-gas', component: GasComponent },
  { path: '', component: HomeComponent },
  { path: 'app-stock-anomaly', component: StockAnomalyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'hockey-bet', component: HockeyBetComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent }
];


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([jwtInterceptor,apiInterceptor])
    )
  ]
}).catch(err => console.error(err));
