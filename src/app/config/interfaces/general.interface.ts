export interface JobPreference {
  id: string;
  name: string;
  category: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description: string;
}

export interface SignUpData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  jobPreferences: string[]; // Array of preference IDs
}

export interface UserData extends Omit<SignUpData, 'username' | 'password' | 'jobPreferences'> {}
export interface SignInData {
  username: string;
  password: string;
}

export interface ResetPasswordData {
  username: string;
  code: string;
  newPassword: string;
}

export   interface SelectOption {
    id: string;
    name: string;
    category: string;
}

export interface Categories {
  categoryId: string;
  name: string;
  description:string;
  snsTopicArn: string;
  createdAt: string|null;
}


export interface CategoriesResponse {
  categories:Categories[]
  count:number
}