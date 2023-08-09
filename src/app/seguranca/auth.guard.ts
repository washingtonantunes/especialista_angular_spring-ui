import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.isAccessTokenInvalido()) {
      return this.auth.obterNovoAccessToken().then(() => {
        if (this.auth.isAccessTokenInvalido()) {
          this.router.navigate(['/login']);
          return false;
        }

        return this.podeAcessarRota(route.data['roles']);
      });
    }

    return this.podeAcessarRota(route.data['roles']);
  }

  podeAcessarRota(roles: string[]): boolean {
    if (roles && !this.auth.temQualquerPermissao(roles)) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }
    return true;
  }
}
