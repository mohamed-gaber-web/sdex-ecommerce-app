import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';

import { StorageService } from './../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const tokenExists = this.storageService.existsStorage('access_token');
    const isExpired = this.isExpired(this.storageService.getExpiresIn());

    if (!tokenExists || isExpired) {
      this.router.navigate(['/user/sign-in'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    return true;
  }

  isExpired(expireIn) {
    return expireIn < Date.now() / 1000;
  }
}
