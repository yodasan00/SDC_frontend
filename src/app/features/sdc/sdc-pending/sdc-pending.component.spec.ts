import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcPendingComponent } from './sdc-pending.component';

describe('SdcPendingComponent', () => {
  let component: SdcPendingComponent;
  let fixture: ComponentFixture<SdcPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdcPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcPendingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
