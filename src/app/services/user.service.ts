import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
}
