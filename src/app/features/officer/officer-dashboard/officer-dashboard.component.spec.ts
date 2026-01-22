import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerDashboardComponent } from './officer-dashboard.component';

describe('OfficerDashboardComponent', () => {
  let component: OfficerDashboardComponent;
  let fixture: ComponentFixture<OfficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
