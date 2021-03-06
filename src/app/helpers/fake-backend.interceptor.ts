import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '@app/models';

const users = [
    { id: 1, email: 'admin@email.com', username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'Admin', role: Role.ADMIN },
    { id: 2, email: 'user@email.com', username: 'user', password: 'user', firstName: 'Normal', lastName: 'Normal', role: Role.USER }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // helper functions
    function ok(body: any) {
        return of(new HttpResponse({ status: 200, body }))
            .pipe(delay(500)); // delay observable to simulate server api call
    }

    function unauthorized() {
        return throwError({ status: 401, error: { message: 'unauthorized' } })
            .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function error(message: string) {
        return throwError({ status: 400, error: { message } })
            .pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {
        const authHeader = headers.get('Authorization') || '';
        return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
        return isLoggedIn() && currentUser().role === Role.ADMIN;
    }

    function currentUser() {
        if (!isLoggedIn()) return;
        const id = parseInt(headers.get('Authorization').split('.')[1]);
        return users.find(x => x.id === id);
    }

    function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
    }

    function getUsers() {
        if (!isAdmin()) return unauthorized();
        return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    // route functions
    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          token: `fake-jwt-token.${user.id}`
      });
    }

    function handleRoute() {
      switch (true) {
          case url.endsWith('/users/authenticate') && method === 'POST':
              return authenticate();
          case url.endsWith('/users') && method === 'GET':
              return getUsers();
          case url.match(/\/users\/\d+$/) && method === 'GET':
              return getUserById();
          default:
              // pass through any requests not handled above
              return next.handle(request);
      }
    }

    return handleRoute();
  }
}
