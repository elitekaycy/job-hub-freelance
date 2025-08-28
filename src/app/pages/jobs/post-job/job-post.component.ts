// job-post.component.ts
import { Component,input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../config/services/apiService/api.service';
import { SingleSelectComponent } from '../../../components/single-select/single-select.component';
import { Categories, Job } from '../../../config/interfaces/general.interface';
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
  job=input<Job | null>(null);  
  saved= output<void>();
  canceled= output<void>();

  jobForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    payAmount: [0, [Validators.required, Validators.min(1)]],
    timeToCompleteDate: [null as Date | null, Validators.required],
    expiryDate: [null as Date | null, Validators.required],
  });

  loading = false;
  jobCategories: Categories[] = [];
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder, 
    private readonly apiService: ApiService, 
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadJobCategories();
    
    // If editing an existing job, populate the form
    if (this.job()) {
      this.jobForm.patchValue({
        name: this.job()?.name ?? '',
        description: this.job()?.description ?? '',
        categoryId: this.job()?.categoryId?? '',
        payAmount: this.job()?.payAmount?? 0,
        timeToCompleteDate: this.durationSecondsToDate(this.job()?.timeToCompleteSeconds?? 0),
        expiryDate: new Date(this.job()?.expiryDate?? 0)
      });
    }
  }

  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  async loadJobCategories(){
    try {
      this.jobCategories = await this.apiService.getCategories();  
    } catch(err) {
      this.toastService.error('Failed to load categories.');
      console.log(err);
    } 
  }

  onCategorySelect(categoryId: string) {
    this.jobForm.patchValue({ categoryId });
  }

  submitJob() {
    if (this.jobForm.invalid) return;
    this.loading = true;

    const payload: any = {
      name: this.jobForm.value.name,
      description: this.jobForm.value.description,
      payAmount: this.jobForm.value.payAmount,
      timeToCompleteSeconds: this.dateToDurationSeconds(this.jobForm.value.timeToCompleteDate || new Date()),
      expirySeconds: this.dateToDurationSeconds(this.jobForm.value.expiryDate || new Date()),
    };

    // Include categoryId only for new jobs (create), not for edits
    if (!this.job()) {
      payload.categoryId = this.jobForm.value.categoryId;
    }

    // Determine if we're creating or updating
    const apiCall = this.job() 
      ? this.apiService.updateJob(this.job()?.jobId!, payload)
      : this.apiService.postJob(payload);

    apiCall.subscribe({
      next: (response) => {
        this.toastService.success(`Job ${this.job() ? 'updated' : 'posted'} successfully!`);
        this.jobForm.reset();
        this.jobForm.patchValue({ categoryId: '' });
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        this.toastService.error(`Failed to ${this.job() ? 'update' : 'post'} job: ${err.message}`);
        this.loading = false;
      }
    });
  }

  cancel() {
    this.canceled.emit();
  }

  // Convert Date to duration seconds from now
  private dateToDurationSeconds(date: Date | null): number {
    if (!date) return 0;
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / 1000)); // Ensure non-negative
  }

  // Convert duration seconds to future Date
  private durationSecondsToDate(seconds: number): Date {
    if (!seconds) return new Date();
    const duration = typeof seconds === 'string' ? Number(seconds) : seconds;
    const now = new Date();
    return new Date(now.getTime() + (duration * 1000));
  }
}