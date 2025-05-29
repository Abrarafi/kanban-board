import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check authentication state synchronously first
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // If not authenticated, redirect to login
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}