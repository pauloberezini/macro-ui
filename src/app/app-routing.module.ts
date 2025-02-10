import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from "./login/sign-in/sign-in.component";
import { SeasonalityComponent } from "./seasonality/seasonality.component";
import { AccessDeniedComponent } from "./login/access-denied/access-denied.component";
import { StockAnomalyComponent } from "./stock-anomaly/stock-anomaly.component";  // ✅ Import your component
import { AuthGuard } from "./login/guard/auth.guard";

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'app-seasonality', component: SeasonalityComponent, canActivate: [AuthGuard] },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'app-stock-anomaly', component: StockAnomalyComponent },  // ✅ Add this line
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },  // ✅ Redirect root to sign-in
  { path: '**', component: AccessDeniedComponent }  // ✅ Catch-all for invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
