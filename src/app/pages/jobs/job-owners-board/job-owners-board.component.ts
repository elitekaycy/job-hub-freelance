import { Component } from '@angular/core';
import { JobBoardComponent } from "../job-board/job-board.component";

@Component({
  selector: 'app-job-owners-board',
  standalone: true,
  imports: [JobBoardComponent],
  template: `<app-job-board mode="jobOwner"></app-job-board>`,
})
export class JobOwnersBoardComponent {

}
