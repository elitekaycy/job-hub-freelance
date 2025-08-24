import { Component } from '@angular/core';
import { JobBoardComponent } from "../job-board/job-board.component";

@Component({
  selector: 'app-job-seekers-board',
  standalone: true,
  imports: [JobBoardComponent],
  template: `<app-job-board mode="jobSeeker"></app-job-board>`,
})
export class JobSeekersBoardComponent {

}
