import { HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { catchError, throwError } from 'rxjs';

const modifyRequest = (req: HttpRequest<unknown>, token: string | null) => {
  const headers = req.headers.set('Authorization', token ? `Bearer ${token}` : '');
  return req.clone({ headers, url: `${environment.origin}${req.url}` });
};

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storedAccessToken = localStorage.getItem(Auth.COOKIE_ACCESS_TOKEN);

  const processRequest = (token: string | null) => {
    const modifiedReq = modifyRequest(req, token);
    const authService = inject(AuthService);
    return next(modifiedReq).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          authService.clearAuth();
        }
        return throwError(() => error);
      })
    );
  };

  return processRequest(storedAccessToken);
};
