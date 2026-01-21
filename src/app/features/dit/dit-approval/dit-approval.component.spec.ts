import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitApprovalComponent } from './dit-approval.component';

describe('DitApprovalComponent', () => {
  let component: DitApprovalComponent;
  let fixture: ComponentFixture<DitApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitApprovalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
