import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '../core/storage';
import { MenuService } from './menu.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs/operators';
import { countryConfig } from 'src/country-config/country-config';

interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  emailVerified: boolean
  role: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  userData: any
  headers = new HttpHeaders(countryConfig.headersNgZorro);

  urls = {
    login : `${this.gateway30}/loginMonitor`,
    conectionAware : `${this.gateway30}/aware/idAgentExtension/`
  }

  loading = false;

  constructor(
    public http: HttpClient,
    public router: Router,
    private menu:MenuService,
    private notification: NzNotificationService,
  ) {
    super(http);
  }

  async SignIn(code: string, password: string) {
    this.loading = true;
    this.http.post(this.urls.login, { employeeNumber: code, password },{ headers: this.headers})
      .pipe(finalize(()=>{
        setTimeout(() => { this.loading = false;}, 800);
      }))
      .subscribe((rta: any) => {
        if (rta.code === 'OK' && rta.data != null) {
          if (rta.data.message === 'Password Errado')
            this.notification.error('Error', 'Credenciales incorrectas, por favor verifique!')
          else if (
            rta.data.message === 'Usuario no Existe' 
            || rta.data.message === 'Usuario Eliminado'
            || rta.data.rolUser === 'NEGOCIO' 
            || rta.data.rolUser === 'MENSAJERO'
          )
            this.notification.error('Error', 'Usuario sin autorización.')
          else {
            Storage.setAll('dataCount', rta.data)
            this.notification.success(
              'Login exitoso',
              'Tus credenciales son correctas, puedes ingresar.')
            this.navigateForRol();
            if(rta?.data?.documentNumber && countryConfig.isColombia && 
              (rta?.data?.rolUser === 'ADMINISTRADOR' || rta.data.rolUser === 'AGENTE CHAT' 
              || rta?.data?.rolUser === 'ANTI-FRAUDE' || rta.data.rolUser === 'AGENTE'
              || rta?.data?.rolUser === 'LIDER CALL' || rta.data.rolUser === 'AGENTE CALL' 
              || rta?.data?.rolUser === 'ASESORES DE SAC' || rta.data.rolUser === 'MONITOR'
              || rta?.data?.rolUser === 'LÍDERES MONITOR' || rta.data.rolUser === 'ASESOR CALL')){
              this.getPortAgent(rta?.data?.documentNumber);
            }
          }
        }
        else {
          this.notification.error('Error', 'Usuario o contraseña incorrectos, por favor verifique!')
        }
      }, error => {
        this.notification.error(error.code, error.message)
      })
  }

  get( url: string ){
    return this.http.get(url, this.httpOptions());
  }

  navigateForRol(){
    this.menu.setMenu();
    switch(this.getLocalUser().rolUser){
      case 'QR':
          this.router.navigate(['/qr']);
      break
      case 'SCANANDGO':
          this.router.navigate(['/scan-go']);
      break
      default:
        if(!!this.getPermissions('dashboard')) {
          this.router.navigate(['/dashboard/express']);
        }
        else if(!!this.getPermissions('search')) {
          this.router.navigate(['/search/search-orders']);
        }
        else {
          this.router.navigate(['/dashboard']);
        }
    }
  }

  get isLoggedIn(): boolean {
    const user = this.getLocalUser();
    return user !== undefined;
  }

  async SignOut() {
    Storage.remove('dataCount');
    Storage.remove('portAgent');
    Storage.clear();
    this.router.navigate(['/system/login'])
  }

  getPortAgent(documentNumber){
    this.get(`${this.urls.conectionAware}${documentNumber}`)
    .subscribe( (data:any) =>{
      if (data?.data?.extension){
        Storage.setAll('portAgent', data?.data?.extension)
      }  
    })
  }
}
