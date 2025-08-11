export interface JobPreference {
  id: string;
  name: string;
  category: string;
}

export interface SignUpData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  jobPreferences: string[]; // Array of preference IDs
}