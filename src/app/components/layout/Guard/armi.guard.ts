import { Injectable } from '@angular/core'
import { Router, CanLoad, Route } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ArmiGuard implements CanLoad {
  
    constructor(
        public authService: AuthService,
        public router: Router
    ) {}

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        if (url.startsWith('/armirene')) { 
            return this.authService.isArmiUser();
        }
        return false;
    }
}