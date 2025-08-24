import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekersBoardComponent } from './job-seekers-board.component';

describe('JobSeekersBoardComponent', () => {
  let component: JobSeekersBoardComponent;
  let fixture: ComponentFixture<JobSeekersBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekersBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobSeekersBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
