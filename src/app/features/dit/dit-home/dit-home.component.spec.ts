import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitHomeComponent } from './dit-home.component';

describe('DitHomeComponent', () => {
  let component: DitHomeComponent;
  let fixture: ComponentFixture<DitHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
