import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../config/services/apiService/api.service';
import { SingleSelectComponent } from '../../../components/single-select/single-select.component';
import { Categories } from '../../../config/interfaces/general.interface';
import { ToastService } from '../../../config/services/toast/toast.service';


@Component({
  selector: 'app-job-post',
  standalone: true,
  imports: [
    SingleSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './job-post.component.html',
  styles: [`
    .form-input {
      @apply w-full px-4 py-2 mb-3 border rounded border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300;
    }`
  ],
})
export class JobPostComponent {
  jobForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    payAmount: [0, [Validators.required, Validators.min(1)]],
    timeToCompleteDate: [null as Date | null, Validators.required], // Explicitly typed
    expiryDate: [null as Date | null, Validators.required], // Explicitly typed
  });

  loading = false;
  jobCategories: Categories[] = [];
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder, 
    private readonly apiService: ApiService , 
    private readonly toastService: ToastService
  )  {}
  ngOnInit() {
    this.loadJobCategories();
  }

  async loadJobCategories(){
    try {
    this.jobCategories = await this.apiService.getCategories()  
  }catch(err){
    this.toastService.error(this.errorMessage);
    console.log(err);
  } 
  }
  onCategorySelect(categoryId: string) {
    this.jobForm.patchValue({ categoryId });
  }

  submitJob() {
  if (this.jobForm.invalid) return;
  this.loading = true;

  const payload = {
    ...this.jobForm.value,
    timeToCompleteSeconds: this.dateToSeconds(this.jobForm.value.timeToCompleteDate || new Date()),
    expirySeconds: this.dateToSeconds(this.jobForm.value.expiryDate   || new Date()),
  };

  //Remove timeToCompleteDate and expiryDate from payload
  delete payload.timeToCompleteDate;
  delete payload.expiryDate;

  this.apiService.postJob(payload).subscribe({
    next: (response) => {
      // Assuming response contains timeToCompleteSeconds and expirySeconds
      this.jobForm.patchValue({
        timeToCompleteDate: this.secondsToDate(response.timeToCompleteSeconds),
        expiryDate: this.secondsToDate(response.expirySeconds),
      });
      this.toastService.success('Job posted successfully!');
      this.jobForm.reset();
      // reset select field on jobForm
      this.jobForm.patchValue({ categoryId: '' });
      this.loading = false;
    },
    error: (err) => {
      this.toastService.error('Failed to post job: ' + err.message);
      this.loading = false;
    }
  });
}

  // Convert Date to seconds since epoch
  private dateToSeconds(date: Date | null): number {
    if (!date) return 0;
    const duration = typeof date === 'string' ? new Date(date) : date;
    return date ? Math.floor(duration.getTime() / 1000) : 0;
  }

  // Convert seconds to Date (for future backend response handling)
  private secondsToDate(seconds: number): Date {
    if (!seconds) return new Date();
    const duration= typeof seconds === 'string' ? Number(seconds) : seconds;
    return new Date(duration * 1000);
  }
}
