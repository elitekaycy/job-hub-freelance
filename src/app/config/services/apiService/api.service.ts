import { Injectable } from '@angular/core';
import { Categories, CategoriesResponse, Job, ListParams } from '../../interfaces/general.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private readonly http: HttpClient) {}

  private readonly apiUrl = environment.baseURL;

  // Fetch data from the /categories endpoint
  async getCategories():Promise<Categories[]> {
    try {
      const response = await fetch(this.apiUrl+'/categories');
      const data= await response.json() as CategoriesResponse; 
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  postJob(job: any): Observable<any> {
    return this.http.post(this.apiUrl+'/job/owner/create', job);
  }

  getJobs(): Observable<any> {
    return this.http.get(this.apiUrl+'/job/owner/list');
  }

  async submitJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl+`/job/seeker/submit/`+jobId, {}));
  }

  async getSeekerJobs(params: ListParams): Promise<any> {
    let urlParams = `/job/seeker/list?type=all&offset=${params.offset}&limit=${params.limit}&sortBy=${params.sort}`;
    if (params.search) urlParams += `&search=${params.search}`;
    if (params.category) urlParams += `&category=${params.category}`;
    if (params.status) urlParams += `&status=${params.status}`;

    return await firstValueFrom(this.http.get(this.apiUrl + urlParams));
  }

  async claimJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl+'/job/seeker/claim/'+jobId, {}));
  }

  async rejectSubmission(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl+`/api/jobs/${jobId}/reject`, {})); // Empty body is required in this case
  }

  async approveSubmission(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.post(this.apiUrl+`/api/jobs/${jobId}/approve`, {})); // Empty body is required in this case
  } 

  async deleteJob(jobId: string): Promise<any> {
    return await firstValueFrom(this.http.delete(this.apiUrl+`/api/jobs/${jobId}`)); // Empty body is required in this case
  }

}
