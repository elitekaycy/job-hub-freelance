import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../config/services/apiService/api.service';
import { AuthService } from '../../config/services/authService/auth-service.service';
import { Categories, Job, ListParams, User } from '../../config/interfaces/general.interface';
import { sortOptions, statusOptions } from '../../config/data/jobs.data';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap, from } from 'rxjs';
import { ToastService } from '../../config/services/toast/toast.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
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

    .action-btn {
      @apply px-2 py-1 rounded text-xs transition;
    }

    .delete-btn {
      @apply bg-red-600 text-white hover:bg-red-700;
    }
  `]
})
export class AdminComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  private readonly searchTerms = new Subject<string>();
  
  jobs: Job[] = [];
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  totalJobs = 0;
  hasMore = false;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedSort = 'newest';
  
  showDetailsModal = false;
  selectedJob: Job | null = null;
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
    this.setupSearchSubscription();
  }

  async init() {
    this.loadJobCategories();
    this.loadJobs();
  }

  loadJobCategories(){
    this.loading=true;

    from(this.apiService.getCategories()).subscribe({
      next: (res) => {
        this.categories.set(res);  
        this.loading=false;
      },
      error: (err) => {
        this.toastService.error('Failed to load categories.'+err);
        this.loading=false;
      }  
    });
  }

  loadJobs() {
    this.loadJobsService().subscribe({
      next: (res) => this.handleResponse(res),
      error: (err) => {
        this.loading = false;
        this.toastService.error('Failed to load jobs. Please try again.');
        console.error('Failed to load jobs:', err);
    }});
  }

  private setupSearchSubscription() {
    this.subscription = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.searchTerm = term;
          this.currentPage = 1;
          return this.loadJobsService(); 
        })
      )
      .subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (err) => {
          this.loading = false;
          this.toastService.error('Search failed: ' + err.message);
        },
      });
  }

  onSearchTermChange(term: string) {
    this.searchTerms.next(term);
  }

  private handleResponse(response: any) {
    this.jobs = response.jobs;
    this.totalJobs = response.total;
    this.hasMore = response.hasMore;
    this.totalPages = Math.ceil(this.totalJobs / this.itemsPerPage);
    this.loading = false;
  }

  private loadJobsService(){
    const params: ListParams = {
      offset: (this.currentPage - 1) * this.itemsPerPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      status: this.selectedStatus || undefined,
      sort: this.selectedSort || undefined,
    };

    return this.apiService.getAdminJobs(params);
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadJobs();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedSort = 'newest';
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
      case 'rejected':
        return 'bg-red-100 text-red-800';
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

  openDetailsModal(job: Job) {
    this.selectedJob = job;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedJob = null;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
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

  async deleteJob(job: Job) {
    if (!confirm(`Are you sure you want to permanently delete the job "${job.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      this.loading = true;
      const response = await this.apiService.deleteAdminJob(job.jobId);
      
      if (response.message) {
        this.toastService.success('Job deleted successfully!');
        this.loading = false;
        this.loadJobs();
      }
    } catch (error) {
      this.loading = false;
      console.error('Failed to delete job:', error);
      this.toastService.error('Failed to delete job. Please try again.');
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
