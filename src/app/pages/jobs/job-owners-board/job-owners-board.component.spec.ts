import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOwnersBoardComponent } from './job-owners-board.component';

describe('JobOwnersBoardComponent', () => {
  let component: JobOwnersBoardComponent;
  let fixture: ComponentFixture<JobOwnersBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOwnersBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOwnersBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
