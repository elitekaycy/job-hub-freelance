import { Injectable } from '@angular/core';
import { Categories, CategoriesResponse } from '../../interfaces/general.interface';
// import {get} from '@aws-amplify/api';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  // Fetch data from the /categories endpoint
  async getCategories():Promise<Categories[]> {
    try {
      // const response = await get({ 
      //   apiName: 'categories', 
      //   path:'/categories'
      // }).response;

      const response = await fetch('https://hc4mdt2ga4.execute-api.eu-central-1.amazonaws.com/dev/categories');

      const data= await response.json() as CategoriesResponse; 
      // console.log('Categories fetched:', data);
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

}
