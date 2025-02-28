import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from "./login/sign-in/sign-in.component";
import { SeasonalityComponent } from "./seasonality/seasonality.component";
import { AccessDeniedComponent } from "./login/access-denied/access-denied.component";
import { StockAnomalyComponent } from "./stock-anomaly/stock-anomaly.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AuthGuard } from "./login/guard/auth.guard";
import {SupportedByComponent} from "./supported-by/supported-by.component";
import {DashGraphsComponent} from "./dash-graphs/dash-graphs.component";
import {NewsComponent} from "./news-list/news.component";
import {InsidersComponent} from "./insiders-page/page/insiders.component";
import {EconomicCalendarComponent} from "./economic-calendar/economic-calendar.component";
import {HockeyBetComponent} from "./hockey-bet/hockey-bet.component";
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import { HomeComponent } from './home/home.component';
import {LegalComponent} from "./pages/legal/legal.component";

const routes: Routes = [
  { path: 'app-economic-calendar', component: EconomicCalendarComponent, canActivate: [AuthGuard] },
  { path: 'app-seasonality', component: SeasonalityComponent, canActivate: [AuthGuard] },
  { path: 'app-stock-anomaly', component: StockAnomalyComponent, canActivate: [AuthGuard] },
  { path: 'app-supported-by', component: SupportedByComponent, canActivate: [AuthGuard] },
  { path: 'dash-graphs', component: DashGraphsComponent, canActivate: [AuthGuard] },
  { path: 'app-news', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'insiders', component: InsidersComponent, canActivate: [AuthGuard] },
  { path: 'hockey-bet', component: HockeyBetComponent },
  { path: '', component: HomeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'legal', component: LegalComponent },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
