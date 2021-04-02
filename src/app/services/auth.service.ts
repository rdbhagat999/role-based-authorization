import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@app/models';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private readonly router: Router, private readonly http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(this.getLocalStorageItem('user'));
    this.user = this.userSubject.asObservable();
  }

  setLocalStorageItem(itemName: string, item: any): void {
    localStorage.setItem(itemName, JSON.stringify(item));
  }

  getLocalStorageItem(itemName: string): any {
    const found = localStorage.getItem(itemName);
    if (found) {
      return JSON.parse(found);
    }
    return null;
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      this.setLocalStorageItem('user', user);
      this.userSubject.next(user);
      return user;
    }));
}

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
