import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcHomeComponent } from './sdc-home.component';

describe('SdcHomeComponent', () => {
  let component: SdcHomeComponent;
  let fixture: ComponentFixture<SdcHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdcHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
