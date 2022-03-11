import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectSnackBarComponent } from './redirect-snack-bar.component';

describe('RedirectSnackBarComponent', () => {
  let component: RedirectSnackBarComponent;
  let fixture: ComponentFixture<RedirectSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectSnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
