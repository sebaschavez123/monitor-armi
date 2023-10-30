import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ScanGoService } from '../../services/scan-go.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-scan-go',
  templateUrl: './scan-go.component.html',
  styleUrls: ['./scan-go.component.css']
})
export class ScanGoComponent implements OnInit {

  menu:Array<any> = [];
  toast = false;
  openSettings = new EventEmitter();
  indexSelected = 1;

  userActivity;
  userInactive: Subject<any> = new Subject();

  constructor(private router:Router,
              public _sS:ScanGoService) {

    this.menu = [
      {name: 'Compras en proceso', url: '/scan-go/process'},
      {name: 'Compras aprobadas', url: '/scan-go/approved'},
      {name: 'Compras canceladas', url: '/scan-go/canceled'},
    ]
    if(this.isAdmin()) this.menu.push({name: 'Usuarios bloqueados', url: '/scan-go/blocked-users'});
    this.setTimeout();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd),
        filter( (event:ActivationEnd) => event.snapshot.firstChild === null),
        map( (event: ActivationEnd) => event.snapshot.data )
      )
      .subscribe(event => {
        if(event.menu_index) {
          this.indexSelected = event.menu_index;
        }
      });
  }

  showToast(){
    this.toast = true;
    setTimeout(()=>{ this.toast = false;}, 3000);
  }

  isAdmin():boolean{
    return this._sS.getLocalUser()?.rolUser === 'ADMINISTRADOR';
  }

  refresh() {
    location.reload();
  }



  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), ((60 * 1000) * 30));
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

}
