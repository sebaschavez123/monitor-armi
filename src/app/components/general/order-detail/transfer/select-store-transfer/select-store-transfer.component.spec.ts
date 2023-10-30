import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStoreTransferComponent } from './select-store-transfer.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
describe('SelectStoreTransferComponent', () => {
  let component: SelectStoreTransferComponent;
  let fixture: ComponentFixture<SelectStoreTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectStoreTransferComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientTestingModule
      ],
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectStoreTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
