/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormAwareComponent } from './form-aware.component';

xdescribe('FormAwareComponent', () => {
  let component: FormAwareComponent;
  let fixture: ComponentFixture<FormAwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
