import { Injectable } from '@angular/core';
import { Categories, CategoriesResponse, ListParams } from '../../interfaces/general.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private readonly http: HttpClient) { }

  private readonly apiUrl = environment.baseURL;

  // Fetch data from the /categories endpoint
  async getCategories(): Promise<Categories[]> {
    try {
      const response = await fetch(this.apiUrl + '/categories');
      const data = await response.json() as CategoriesResponse;
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  postJob(job: any): Observable<any> {
    return this.http.post(this.apiUrl + '/job/owner/create', job);
  }

  updateJob(jobId: string, job: any): Observable<any> {
    return this.http.put(this.apiUrl + `/job/owner/edit/` + jobId, job);
  }

  async submitJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl + `/job/seeker/submit/` + jobId, {}));
  }

  getJobs(params: ListParams, type: string): Observable<any> {
    let endpoint = type === 'jobOwner' ? '/job/owner/list' : '/job/seeker/list';
    let urlParams = `${endpoint}?type=all&offset=${params.offset}&limit=${params.limit}&sortBy=${params.sort}`;
    if (params.search) urlParams += `&search=${params.search}`;
    if (params.category) urlParams += `&category=${params.category}`;
    if (params.status) urlParams += `&status=${params.status}`;

    return this.http.get(this.apiUrl + urlParams);
  }

  async claimJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl + '/job/seeker/claim/' + jobId, {}));
  }

  

  getOverview(): Observable<any> {
    return this.http.get(this.apiUrl + '/job/overview');
  }

  async approveJobWithMessage(jobId: string, message: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl + '/job/owner/approve/' + jobId, { message }));
  }

  async rejectJobWithMessage(jobId: string, message: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl + '/job/owner/reject/' + jobId, { message }));
  }

  async deleteJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.delete(this.apiUrl + '/job/owner/delete/' + jobId));
  }

  getAdminJobs(params: ListParams): Observable<any> {
    let urlParams = `/admin/job?type=all&offset=${params.offset}&limit=${params.limit}&sortBy=${params.sort}`;
    if (params.search) urlParams += `&query=${params.search}`;
    if (params.category) urlParams += `&categoryId=${params.category}`;
    if (params.status) urlParams += `&status=${params.status}`;

    return this.http.get(this.apiUrl + urlParams);
  }

  async getAdminJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.get(this.apiUrl + `/admin/job/${jobId}`));
  }

  async deleteAdminJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.delete(this.apiUrl + `/admin/job/${jobId}/delete`));
  }

  getAdminStatistics(): Observable<any> {
    return this.http.get(this.apiUrl + '/admin/job/statistics');
  }

}
