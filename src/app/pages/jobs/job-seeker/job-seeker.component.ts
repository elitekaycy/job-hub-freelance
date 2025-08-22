import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../config/services/apiService/api.service';
import { AuthService } from '../../../config/services/authService/auth-service.service';
import { Categories, Job, User } from '../../../config/interfaces/general.interface';
import { sortOptions, statusOptions } from '../../../config/data/jobs.data';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-job-seekers-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-seeker.component.html',
  styles: [`
    .job-card {
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
    }
    
    .job-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-left-color: #3b82f6;
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
    }
  `]
})
export class JobSeekersBoardComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedSort = 'newest';
  
  currentUser: User | null = null;
  showClaimModal = false;
  showSubmitModal = false;
  selectedJob: Job | null = null;
  submissionDetails = '';
  jobSeekerId= '';

  statusOptions = signal(statusOptions)
  sortOptions = signal(sortOptions)
  categories = signal<Categories[]>([]);
  
  errorMessage = '';
  loading = false;


  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService
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
    }
  }

  async loadJobCategories(){
      try {
      const jobPreferences= await this.apiService.getCategories()
      this.categories.set(jobPreferences);  
    }catch(err){
      this.errorMessage = 'Failed to load categories.';
      console.log(err);
    } 
  }

  async loadJobs() {
    try {
      this.loading = true;
      const seekerJobs = await this.apiService.getSeekerJobs();
      console.log('Loaded jobs:', seekerJobs);
      this.loading = false;
      this.jobSeekerId = seekerJobs.seekerId;  
      this.jobs = seekerJobs.jobs;
      this.applyFilters();
    } catch (error) {
      this.loading = false;
      console.error('Failed to load jobs:', error);
    }
  }

  applyFilters() {
    // Apply search filter
    this.filteredJobs = this.jobs.filter(job => 
      job.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Apply category filter
    if (this.selectedCategory) {
      this.filteredJobs = this.filteredJobs.filter(job => 
        job.categoryId === this.selectedCategory
      );
    }
    
    // Apply status filter
    if (this.selectedStatus) {
      this.filteredJobs = this.filteredJobs.filter(job => 
        job.status === this.selectedStatus
      );
    }

    // Apply sorting
    switch (this.selectedSort) {
      case 'newest':
        this.filteredJobs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'highest':
        this.filteredJobs.sort((a, b) => b.payAmount - a.payAmount);
        break;
      case 'closing':
        this.filteredJobs.sort((a, b) => 
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
        break;
    }

    // Calculate pagination
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedJobs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
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

  canUnclaimJob(job: Job): boolean {
    return this.isJobClaimedByUser(job) && job.status === 'claimed';
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

  async claimJob() {
    if (!this.selectedJob) return;
    try {
      this.loading=true
      const response = await this.apiService.claimJob(this.selectedJob.jobId);
      if (response) {
        alert('Job claimed successfully!');
        this.closeClaimModal();
        this.loadJobs(); // Refresh the job list
      }
      this.loading=false
    } catch (error) {
      this.loading=false
      console.error('Failed to claim job:', error);
      alert('Failed to claim job. Please try again.');
    }
  }

  async submitJob() {
    if (!this.selectedJob || !this.submissionDetails.trim()) {
      alert('Please provide submission details.');
      return;
    }

    try {
      const response = await this.apiService.submitJob(
        this.selectedJob.jobId, 
      );
      
      if (response.success) {
        alert('Job submitted successfully!');
        this.closeSubmitModal();
        this.loadJobs(); // Refresh the job list
      } else {
        alert('Failed to submit job: ' + response.message);
      }
    } catch (error) {
      console.error('Failed to submit job:', error);
      alert('Failed to submit job. Please try again.');
    }
  }
}
