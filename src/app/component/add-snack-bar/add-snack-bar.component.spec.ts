import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSnackBarComponent } from './add-snack-bar.component';

describe('AddSnackBarComponent', () => {
  let component: AddSnackBarComponent;
  let fixture: ComponentFixture<AddSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
