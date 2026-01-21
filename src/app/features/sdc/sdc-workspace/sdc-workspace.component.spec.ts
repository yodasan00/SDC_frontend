import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdcWorkspaceComponent } from './sdc-workspace.component';

describe('SdcWorkspaceComponent', () => {
  let component: SdcWorkspaceComponent;
  let fixture: ComponentFixture<SdcWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SdcWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdcWorkspaceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
