import { HttpInterceptorFn } from '@angular/common/http';
import { from} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { fetchAuthSession } from 'aws-amplify/auth';

// Use HttpInterceptorFn for Angular 17+ standalone
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(fetchAuthSession()).pipe(
    switchMap(session => {
      const token = session.tokens?.idToken?.toString();
      if (!token) {
        return next(req); // No token, proceed without Authorization header
      }
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      return next(authReq);
    }),
    catchError(() => {
      // If session fetch fails (e.g., user not logged in), proceed without token
      return next(req);
    })
  );
};


