import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services';
import { environment } from '@env/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const user = this.authService?.userValue;
    const isLoggedIn = !!user?.token;
    const isApiUrl = request?.url?.startsWith(environment?.apiUrl);

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user?.token}`
        }
      });
    }

    return next.handle(request);
  }
}
