import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '../../../core/storage';

@Injectable({
  providedIn: 'root',
})
export class ScanGoGuard{
  
  constructor(){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    let dataUser:any = Storage.getAll('datacount');
            return dataUser.rolUser == 'ADMINISTRADOR' || dataUser.rolUser == 'SCANANDGO';
  }
}