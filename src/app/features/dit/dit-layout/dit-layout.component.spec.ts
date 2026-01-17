import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitLayoutComponent } from './dit-layout.component';

describe('DitLayoutComponent', () => {
  let component: DitLayoutComponent;
  let fixture: ComponentFixture<DitLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
