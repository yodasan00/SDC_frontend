import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitCompletedTicketsComponent } from './dit-completed-tickets.component';

describe('DitCompletedTicketsComponent', () => {
  let component: DitCompletedTicketsComponent;
  let fixture: ComponentFixture<DitCompletedTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitCompletedTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitCompletedTicketsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
