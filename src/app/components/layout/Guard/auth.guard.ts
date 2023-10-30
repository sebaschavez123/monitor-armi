import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service'
import { Observable, of, timeout } from 'rxjs'
import { VersionCheckService } from '../../../services/version-check.service';
import { MenuService } from '../../../services/menu.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService,
              public router: Router,
              private versionCheck:VersionCheckService,
              private menuService: MenuService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.versionCheck.initVersionCheck();
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['system/login'])
    }
    if(this.authService.initList()) {
      return of(this.isPermission(state.url))
        .pipe(timeout(500));
    } else {
      this.isPermission(state.url);
    }
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    if (url.startsWith('/dashboard')) { 
      return (this.authService.isLoggedIn);
    }
    return false;
  }


  private isPermission(path){
    try {
      const item = this.menuService.getItem(path);
      return Object.keys(this.menuService.modules)
      .filter(name => name.split('/').filter(subName => subName === item.moduleName).length > 0 )[0] !== undefined;
    } catch ( error ){ return false; }
  }
}
