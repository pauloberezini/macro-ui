import { Routes } from '@angular/router';

export const routes: Routes = [
  // Define your routes here
  // Example:
  // { path: '', component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' } // Catch-all route for unmatched paths
];
