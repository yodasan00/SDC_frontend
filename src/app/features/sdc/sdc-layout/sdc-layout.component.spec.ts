import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcLayoutComponent } from './sdc-layout.component';

describe('SdcLayoutComponent', () => {
  let component: SdcLayoutComponent;
  let fixture: ComponentFixture<SdcLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdcLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
