import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';
import { countryConfig } from 'src/country-config/country-config';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

const app = initializeApp(countryConfig.firebaseConfig);

@Component({
  selector: 'app-root',
  template: `
  <ng-progress aria-progressbar-name="progressbar-main"></ng-progress>
  <router-outlet></router-outlet>
`,
})

export class AppComponent {
  constructor(router:Router, _authS:AuthService, private titleService: Title){
    this.getFireAuth()
    if(!_authS.isLoggedIn) router.navigate(['/system'])
    this.titleService.setTitle(countryConfig.isColombia ? 'Monitor Farmatodo Colombia' : 'Monitor Farmatodo Venezuela');
  }

  getFireAuth(){
    const auth = getAuth( app )
    signInAnonymously(auth).then()
  }
}
