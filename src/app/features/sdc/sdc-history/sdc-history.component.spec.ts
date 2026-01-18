import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcHistoryComponent } from './sdc-history.component';

describe('SdcHistoryComponent', () => {
  let component: SdcHistoryComponent;
  let fixture: ComponentFixture<SdcHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdcHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
