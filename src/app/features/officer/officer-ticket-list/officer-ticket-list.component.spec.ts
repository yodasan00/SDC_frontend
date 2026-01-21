import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerTicketListComponent } from './officer-ticket-list.component';

describe('OfficerTicketListComponent', () => {
  let component: OfficerTicketListComponent;
  let fixture: ComponentFixture<OfficerTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerTicketListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerTicketListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
