import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  
  try {
    // First check if user is authenticated
    console.log('Admin Guard: Checking authentication...');
    const currentUser = await getCurrentUser();
    console.log('Admin Guard: User is authenticated:', currentUser);
    
    // Then get the session with tokens
    console.log('Admin Guard: Fetching session...');
    const session = await fetchAuthSession({ forceRefresh: true });
    console.log('Admin Guard: Full session:', session);
    
    if (!session.tokens?.accessToken) {
      console.log('Admin Guard: No access token available - redirecting to signin');
      router.navigate(['/auth/signin']);
      return false;
    }
    
    console.log('Admin Guard: Access token payload:', session.tokens.accessToken.payload);
    const groups = session.tokens.accessToken.payload['cognito:groups'] as string[] | undefined;
    console.log('Admin Guard: User groups:', groups);
    
    if (groups && groups.includes('ADMIN')) {
      console.log('Admin Guard: User is in ADMIN group - access granted');
      return true;
    }
    
    console.log('Admin Guard: User is not in ADMIN group - redirecting to dashboard');
    router.navigate(['/dashboard']);
    return false;
    
  } catch (error) {
    console.error('Admin Guard: Error getting user session:', error);
    console.log('Admin Guard: Authentication error - redirecting to signin');
    router.navigate(['/auth/signin']);
    return false;
  }
};