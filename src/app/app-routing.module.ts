import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInComponent} from "./login/sign-in/sign-in.component";
import {SeasonalityComponent} from "./seasonality/seasonality.component";
import {AccessDeniedComponent} from "./login/guard/access-denied.component";
import {AuthGuard} from "./login/guard/auth.guard";

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  // Protect the SeasonalityComponent route with AuthGuard.
  { path: 'app-seasonality', component: SeasonalityComponent, canActivate: [AuthGuard] },
  // Route for the access denied page.
  { path: 'access-denied', component: AccessDeniedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
