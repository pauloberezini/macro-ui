import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (token) {
      console.log("AuthGuard: Access granted to", state.url);
      return true;
    } else {
      console.log("AuthGuard: Redirecting to Sign In");
      return this.router.createUrlTree(['/sign-in'], {
        queryParams: { returnUrl: state.url }
      });
    }
  }

}
