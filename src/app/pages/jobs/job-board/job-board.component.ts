// job-board.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../config/services/apiService/api.service';
import { AuthService } from '../../../config/services/authService/auth-service.service';
import { Job, User } from '../../../config/interfaces/general.interface';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-job-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './job-board.component.html',
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
    
    .action-menu {
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(-10px);
    }
    
    .job-card:hover .action-menu {
      opacity: 1;
      transform: translateY(0);
    }
  `]
})
export class JobBoardComponent implements OnInit {
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
  showActionMenu: string | null = null;
  
  categories = [
    { id: 'design', name: 'Design & Creative' },
    { id: 'development', name: 'Development & IT' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'writing', name: 'Writing' }
  ];

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'claimed', label: 'Claimed' }
  ];

  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'highest', label: 'Highest Pay' },
    { value: 'closing', label: 'Closing Soonest' }
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.init();
  }

  private async init() {
    await this.loadCurrentUser();
    await this.loadJobs();
  }

  async loadCurrentUser() {
    try {
       await firstValueFrom(this.authService.getUserAttributes())
        .then((attributes: any) => {
          this.currentUser = attributes;
        });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  async loadJobs() {
    try {
      // Get jobs with category names included
      await firstValueFrom(this.apiService.getJobs()).then((jobs: any) => {
        this.jobs = jobs;
      });
      
      // If the current user has preferred categories, filter by them
      if (this.currentUser?.jobPreferences?.length) {
        this.selectedCategory = this.currentUser.jobPreferences[0];
      }
      
      this.applyFilters();
    } catch (error) {
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
    this.currentPage = 1; // Reset to first page when filters change
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'claimed':
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

  getCompletionDate(job: Job): string {
    const createdDate = new Date(job.createdAt);
    const completionDate = new Date(createdDate.getTime() + (job.timeToCompleteSeconds * 1000));
    return this.formatDate(completionDate.toISOString());
  }

  isJobOwner(job: Job): boolean {
    return this.currentUser?.email === job.ownerId;
  }

  isJobClaimer(job: Job): boolean {
    return this.currentUser?.email === job.claimerId;
  }

  canClaimJob(job: Job): boolean {
    return !this.isJobOwner(job) && 
           job.status === 'active' && 
           !job.claimerId &&
           new Date(job.expiryDate) > new Date();
  }

  canSubmitJob(job: Job): boolean {
    return this.isJobClaimer(job) && 
           job.status === 'claimed' && 
           (!job.submissionDeadline || new Date(job.submissionDeadline) > new Date());
  }

  toggleActionMenu(jobId: string) {
    this.showActionMenu = this.showActionMenu === jobId ? null : jobId;
  }

  async claimJob(job: Job) {
    try {
      await this.apiService.claimJob(job.jobId, this.currentUser!.email);
      alert('Job claimed successfully!');
      this.loadJobs(); // Reload jobs to update the UI
    } catch (error) {
      console.error('Failed to claim job:', error);
      alert('Failed to claim job. Please try again.');
    }
  }

  async deleteJob(job: Job) {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await this.apiService.deleteJob(job.jobId);
        alert('Job deleted successfully!');
        this.loadJobs(); // Reload jobs to update the UI
      } catch (error) {
        console.error('Failed to delete job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  }

  async submitJob(job: Job) {
    // This would typically open a modal or navigate to a submission page
    alert('Redirecting to job submission page...');
  }

  async approveSubmission(job: Job) {
    try {
      await this.apiService.approveSubmission(job.jobId);
      alert('Submission approved successfully!');
      this.loadJobs(); // Reload jobs to update the UI
    } catch (error) {
      console.error('Failed to approve submission:', error);
      alert('Failed to approve submission. Please try again.');
    }
  }

  async rejectSubmission(job: Job) {
    try {
      await this.apiService.rejectSubmission(job.jobId);
      alert('Submission rejected successfully!');
      this.loadJobs(); // Reload jobs to update the UI
    } catch (error) {
      console.error('Failed to reject submission:', error);
      alert('Failed to reject submission. Please try again.');
    }
  }
}