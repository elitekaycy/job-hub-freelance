import { Injectable } from '@angular/core';
import { Categories, CategoriesResponse } from '../../interfaces/general.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
// import {get} from '@aws-amplify/api';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private readonly http: HttpClient) {}

  private readonly apiUrl = environment.baseURL; // Replace with Amplify endpoint

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



  // Generic method for flexibility (optional)
  // async callApi(method: 'get' | 'post', apiName: string, path: string, data?: any): Promise<any> {
  //   try {
  //     const options = data ? { body: data } : {};
  //     const response = await (method === 'get' ? get({ apiName, path }) : post({ apiName, path, options })).response;
  //     const result = await response.body.json();
  //     console.log(`${method.toUpperCase()} ${path} successful:`, result);
  //     return result;
  //   } catch (error) {
  //     console.error(`Error in ${method.toUpperCase()} ${path}:`, error);
  //     throw error;
  //   }
  // }

  postJob(job: any): Observable<any> {
    return this.http.post(this.apiUrl+'/job/owner/create', job);
  }

}
