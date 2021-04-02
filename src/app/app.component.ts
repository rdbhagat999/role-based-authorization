import { Component } from '@angular/core';
import { Role, User } from './models';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'role-based-authorization';

  user: User;

  constructor(private authService: AuthService) {
      this.authService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
      return this.user?.role === Role.ADMIN;
  }

  logout() {
      this.authService.logout();
  }
}
