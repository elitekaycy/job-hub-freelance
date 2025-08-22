import { SelectOption } from "../interfaces/general.interface";

  // export const jobPreferenceOptions: SelectOption[] = [
  //   { id: 'tech', name: 'Technology', category: 'Industry' },
  //   { id: 'finance', name: 'Finance', category: 'Industry' },
  //   { id: 'healthcare', name: 'Healthcare', category: 'Industry' },
  //   { id: 'education', name: 'Education', category: 'Industry' },
  //   { id: 'marketing', name: 'Marketing', category: 'Industry' },
  //   { id: 'remote', name: 'Remote Work', category: 'Work Type' },
  //   { id: 'fulltime', name: 'Full Time', category: 'Work Type' },
  //   { id: 'parttime', name: 'Part Time', category: 'Work Type' },
  //   { id: 'contract', name: 'Contract', category: 'Work Type' },
  //   { id: 'freelance', name: 'Freelance', category: 'Work Type' }
  // ];

  export const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'claimed', label: 'Claimed' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  export const  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'highest', label: 'Highest Pay' },
    { value: 'closing', label: 'Closing Soonest' }
  ];

