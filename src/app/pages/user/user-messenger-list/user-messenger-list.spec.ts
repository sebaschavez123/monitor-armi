import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMessengerListComponent } from './user-messenger-list.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { countryConfig } from 'src/country-config/country-config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared.module';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

describe('UserMessengerListComponent', () => {
    let component: UserMessengerListComponent;
    let fixture: ComponentFixture<UserMessengerListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserMessengerListComponent],
            imports: [
                HttpClientTestingModule,
                AngularFireModule.initializeApp(countryConfig?.firebaseConfig),
                AngularFireDatabaseModule,
                BrowserAnimationsModule,
                FormsModule,  // Agrega los módulos de formularios
                ReactiveFormsModule,  // Agrega los módulos de formularios
                SharedModule,
                ToastrModule.forRoot()
              ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserMessengerListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a filterByStatePhoto method', () => {
        expect(component.filterByStatePhoto).toBeTruthy();
    }
    );
    it('should show "Aprobada"', () => {
        expect(component.getStatusName(1)).toEqual('Aprobada');
    });
    it('should show "Pendiente"', () => {
        expect(component.getStatusName(0)).toEqual('Pendiente');
    });
    it('should show "Rechazada"', () => {
        expect(component.getStatusName(2)).toEqual('Rechazada');
    });
    it('should show "Sin foto"', () => {
        expect(component.getStatusName(undefined)).toEqual('Sin foto');
    });

});
