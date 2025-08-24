import { Component, OnInit, signal, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../config/services/apiService/api.service';
import { AuthService } from '../../../config/services/authService/auth-service.service';
import { Categories, Job, ListParams, User } from '../../../config/interfaces/general.interface';
import { sortOptions, statusOptions } from '../../../config/data/jobs.data';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../config/services/toast/toast.service';

@Component({
  selector: 'app-job-seekers-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-seeker.component.html',
  styles: [`
    .job-card {
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
      cursor: pointer;
    }
    
    .job-card:hover, .job-card:focus {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-left-color: #3b82f6;
      outline: none;
    }

    .job-card.focused {
      border: 2px solid #3b82f6;
      transform: scale(1.02);
    }
    
    .pagination-btn {
      transition: all 0.2s ease;
    }
    
    .pagination-btn:hover:not(.disabled) {
      background-color: #3b82f6;
      color: white;
    }
    
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
    }

    .form-input {
      @apply w-full px-4 py-2 mb-3 border rounded border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300;
    }
    
    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal {
      transition: all 0.3s ease-out;
      max-height: 90vh;
      overflow-y: auto;
    }

    .description-clamp {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class JobSeekersBoardComponent implements OnInit {
  jobs: Job[] = [];
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  totalJobs = 0;
  hasMore = false;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedSort = 'createdAt';
  
  currentUser: User | null = null;
  showClaimModal = false;
  showSubmitModal = false;
  showDetailsModal = false;
  selectedJob: Job | null = null;
  submissionDetails = '';
  jobSeekerId= '';
  focusedJobId: string | null = null;

  statusOptions = signal(statusOptions)
  sortOptions = signal(sortOptions)
  categories = signal<Categories[]>([]);
  
  errorMessage = '';
  loading = false;


  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService 
  ) {}

   ngOnInit() {
      this.init();
    }

  async init() {
    await this.loadJobCategories();
    await this.loadCurrentUser();
    await this.loadJobs();
  }

  async loadCurrentUser() {
    try {
      this.currentUser = await firstValueFrom(this.authService.getUserAttributes()) ;
    } catch (error) {
      console.error('Failed to load user data:', error);
      this.toastService.error('Failed to load user data. Please try again.');
    }
  }

  async loadJobCategories(){
      try {
      this.loading=true;
      const jobPreferences= await this.apiService.getCategories()
      this.categories.set(jobPreferences);  
    }catch(err){
      this.toastService.error('Failed to load categories.'+err);
      console.log(err);
    } 
  }

  async loadJobs() {
    try {
      const params: ListParams = {
        offset: this.currentPage-1,
        limit: this.itemsPerPage,
        search: this.searchTerm,
        category: this.selectedCategory,
        status: this.selectedStatus,
        sort: this.selectedSort
      };

      this.loading = true;
      const seekerJobs = await this.apiService.getSeekerJobs(params);
      console.log('Loaded jobs:', seekerJobs);
      this.loading = false;
      this.jobSeekerId = seekerJobs.seekerId;  
      this.jobs = seekerJobs.jobs;
      this.totalJobs = seekerJobs.total;
      this.hasMore = seekerJobs.hasMore;

      this.totalPages = Math.ceil(this.totalJobs / this.itemsPerPage);

    } catch (error) {
      this.loading = false;
      console.error('Failed to load jobs:', error);
      this.toastService.error('Failed to load jobs. Please try again.');
    }
  }

  applyFilters() {
    this.currentPage = 1; // Reset to first page when filters change
    this.loadJobs();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedSort = 'createdAt';
    this.applyFilters();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryIcon(categoryId: string): string {
    switch (categoryId) {
      case 'design':
        return '🎨';
      case 'development':
        return '💻';
      case 'marketing':
        return '📈';
      case 'writing':
        return '✏️';
      default:
        return '📋';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getJobCategoryName(categoryId: string): string {
    const category = this.categories().filter(category => category.categoryId === categoryId)[0];
    return category ? category.name : '';
  }

  getCompletionDate(job: Job): string {
    const createdDate = new Date(job.createdAt);
    const completionDate = new Date(createdDate.getTime() + (job.timeToCompleteSeconds * 1000));
    return this.formatDate(completionDate.toISOString());
  }

  isJobClaimedByUser(job: Job): boolean {
    return job.claimerId === this.jobSeekerId;
  }

  canClaimJob(job: Job): boolean {
    return (job.status === 'open'  && new Date(job.expiryDate) > new Date());
  }

  canSubmitJob(job: Job): boolean {
    return this.isJobClaimedByUser(job) && job.status === 'claimed';
  }

  openClaimModal(job: Job) {
    this.selectedJob = job;
    this.showClaimModal = true;
  }

  closeClaimModal() {
    this.showClaimModal = false;
    this.selectedJob = null;
  }

  openSubmitModal(job: Job) {
    this.selectedJob = job;
    this.submissionDetails = '';
    this.showSubmitModal = true;
  }

  closeSubmitModal() {
    this.showSubmitModal = false;
    this.selectedJob = null;
    this.submissionDetails = '';
  }

  openDetailsModal(job: Job) {
    this.selectedJob = job;
    this.showDetailsModal = true;
    console.log(job,"details modal", this.showDetailsModal);
  }

  closeDetailsModal() {
    console.log(this.showDetailsModal,"details modal");
    this.showDetailsModal = false;
    this.selectedJob = null;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Close details modal on Escape key
    if (this.showDetailsModal && event.key === 'Escape') {
      this.closeDetailsModal();
    }
  }

  setFocus(jobId: string) {
    this.focusedJobId = jobId;
  }

  removeFocus() {
    this.focusedJobId = null;
  }


  async claimJob() {
    if (!this.selectedJob) return;
    try {
      this.loading=true
      const response = await this.apiService.claimJob(this.selectedJob.jobId);
      if (response.message) {
        this.toastService.success('Job claimed successfully!', 5000); 
        this.closeClaimModal();
        this.loadJobs();
      }
      this.loading=false
    } catch (error) {
      this.loading=false
      console.error('Failed to claim job:', error);
      this.toastService.error('Failed to claim job: ' + error, 5000);
    }
  }

  async submitJob() {
    if (!this.selectedJob || !this.submissionDetails.trim()) {
      this.toastService.error('Please provide submission details.');
      return;
    }

    try {
      this.loading = true;
      const response = await this.apiService.submitJob(this.selectedJob.jobId);
      
      if (response.message) {
        this.toastService.success('Job submitted successfully!');
        this.loading = false;
        this.closeSubmitModal();
        this.loadJobs(); 
      }
    } catch (error) {
      this.loading=false;
      console.error('Failed to submit job:', error);
      this.toastService.error('Failed to submit job. Please try again.');
    }
  }
}
