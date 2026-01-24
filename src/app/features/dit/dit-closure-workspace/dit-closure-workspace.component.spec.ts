import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitClosureWorkspaceComponent } from './dit-closure-workspace.component';

describe('DitClosureWorkspaceComponent', () => {
  let component: DitClosureWorkspaceComponent;
  let fixture: ComponentFixture<DitClosureWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DitClosureWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitClosureWorkspaceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
