import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { MenuService } from '../../services/menu.service';
import { LayoutAppComponent } from './app.component';
import { SharedModule } from 'src/app/shared.module';

const userMock = { rolUser: 'ADMINISTRADOR' };

const MenuServiceMock = {
    isFullScreen: () => false,
    getLocalUser: () => { return userMock },
};

describe('LayoutAuth Component', () => {
    let component: LayoutAppComponent;
    let fixture: ComponentFixture<LayoutAppComponent>;
  
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LayoutAppComponent],
        imports:[
            RouterTestingModule,
            HttpClientTestingModule,
            BrowserAnimationsModule,
            SharedModule,
        ],
        providers:[
            provideMockStore({}),
            { provide: MenuService, useValue: MenuServiceMock }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(LayoutAppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
                
});