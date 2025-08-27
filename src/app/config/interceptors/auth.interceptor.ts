import { HttpInterceptorFn } from '@angular/common/http';
import { from} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { fetchAuthSession } from 'aws-amplify/auth';

// Use HttpInterceptorFn for Angular 17+ standalone
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(fetchAuthSession()).pipe(
    switchMap(session => {
      const token = session.tokens?.idToken?.toString();
      console.log('Auth interceptor - URL:', req.url, 'Token available:', !!token);
      if (!token) {
        console.log('No token available for URL:', req.url);
        return next(req); // No token, proceed without Authorization header
      }
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('Added auth header for URL:', req.url);
      return next(authReq);
    }),
    catchError((error) => {
      // If session fetch fails (e.g., user not logged in), proceed without token
      console.error('Auth session fetch failed for URL:', req.url, error);
      return next(req);
    })
  );
};


