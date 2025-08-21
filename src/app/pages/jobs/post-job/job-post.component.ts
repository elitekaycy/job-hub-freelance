import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../config/services/apiService/api.service';
import { SingleSelectComponent } from '../../../components/single-select/single-select.component';

@Component({
  selector: 'app-job-post',
  standalone: true,
  imports: [SingleSelectComponent,ReactiveFormsModule],
  templateUrl: './job-post.component.html',
})
export class JobPostComponent {
  jobForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    payAmount: [0, [Validators.required, Validators.min(1)]],
    timeToCompleteSeconds: [0, [Validators.required, Validators.min(1)]],
    expirySeconds: [0, [Validators.required, Validators.min(1)]],
  });

  loading = false;

  categories = [
    { id: '1', name: 'Design' ,description: 'Design' },
    { id: '2', name: 'Development' ,description: 'Development' },
    { id: '3', name: 'Writing' ,description: 'Writing' },
  ];

  constructor(private readonly fb: FormBuilder, private readonly apiService: ApiService) {}

  onCategorySelect(categoryId: string) {
    this.jobForm.patchValue({ categoryId });
  }

  submitJob() {
    if (this.jobForm.invalid) return;
    this.loading = true;

    this.apiService.postJob(this.jobForm.value).subscribe({
      next: () => {
        alert('Job posted successfully!');
        this.jobForm.reset();
        this.loading = false;
      },
      error: (err) => {
        alert('Failed to post job: ' + err.message);
        this.loading = false;
      }
    });
  }
}
