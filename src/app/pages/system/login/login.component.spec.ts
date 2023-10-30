import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { SystemRouterModule } from '../system-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';

describe('Login Component', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
  
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports:[
          FormsModule,
          HttpClientTestingModule,
          FormsModule,
          ReactiveFormsModule,
          SystemRouterModule,
          RouterTestingModule
        ],
        providers:[],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
    
    it('getter code() ', () => {
        component.form.controls.code.setValue(99);
        let resp = component.code;
        expect(resp.value).toBe(99);
    });
    
    it('getter password() ', () => {
        component.form.controls.password.setValue('abcd1234');
        let resp = component.password;
        expect(resp.value).toBe('abcd1234');
    });

    it('submitForm (Method) ', () => {
        const vm = fixture.debugElement.injector.get(AuthService);
        const spyAuthService = spyOn(vm, 'SignIn');
        component.code.setValue(3109);
        component.password.setValue('3109');
        component.submitForm();
        expect(spyAuthService).toHaveBeenCalled();

    });

    it('submitForm (Method) [Invalid] ', () => {
        const vm = fixture.debugElement.injector.get(AuthService);
        const spyAuthService = spyOn(vm, 'SignIn');
        component.submitForm();
        expect(spyAuthService).not.toHaveBeenCalled();    
    });
    
});