import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerHomeComponent } from './officer-home.component';

describe('OfficerHomeComponent', () => {
  let component: OfficerHomeComponent;
  let fixture: ComponentFixture<OfficerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
