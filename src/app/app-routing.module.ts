import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {MaintenanceComponent} from "./maintenance/maintenance.component";

const routes: Routes = [
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'maintenance' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
