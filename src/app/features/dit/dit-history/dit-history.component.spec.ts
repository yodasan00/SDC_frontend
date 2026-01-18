import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitHistoryComponent } from './dit-history.component';

describe('DitHistoryComponent', () => {
  let component: DitHistoryComponent;
  let fixture: ComponentFixture<DitHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
