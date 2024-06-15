import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isLoggedIn = !!localStorage.getItem('id_token');
    const allowedRoutes = ['/', '/registro'];

    if (isLoggedIn || allowedRoutes.includes(state.url)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
