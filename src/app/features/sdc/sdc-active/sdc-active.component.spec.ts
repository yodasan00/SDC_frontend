import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcActiveComponent } from './sdc-active.component';

describe('SdcActiveComponent', () => {
  let component: SdcActiveComponent;
  let fixture: ComponentFixture<SdcActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdcActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcActiveComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
