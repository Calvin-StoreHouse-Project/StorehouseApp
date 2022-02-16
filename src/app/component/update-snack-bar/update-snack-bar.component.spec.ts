import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSnackBarComponent } from './update-snack-bar.component';

describe('UpdateSnackBarComponent', () => {
  let component: UpdateSnackBarComponent;
  let fixture: ComponentFixture<UpdateSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
