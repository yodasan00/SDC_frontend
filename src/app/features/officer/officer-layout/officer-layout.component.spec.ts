import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerLayoutComponent } from './officer-layout.component';

describe('OfficerLayoutComponent', () => {
  let component: OfficerLayoutComponent;
  let fixture: ComponentFixture<OfficerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
