import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitPendingComponent } from './dit-pending.component';

describe('DitPendingComponent', () => {
  let component: DitPendingComponent;
  let fixture: ComponentFixture<DitPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitPendingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
