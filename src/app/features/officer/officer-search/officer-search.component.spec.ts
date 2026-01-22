import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerSearchComponent } from './officer-search.component';

describe('OfficerSearchComponent', () => {
  let component: OfficerSearchComponent;
  let fixture: ComponentFixture<OfficerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
