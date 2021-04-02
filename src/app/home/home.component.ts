import { Component, OnInit } from '@angular/core';
import { User } from '@app/models';
import { AuthService, UserService } from '@app/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  user: User;
  userFromApi: User;

  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    this.user = this.authService.userValue;
    this.getUserFromApi();
   }

  ngOnInit(): void {
  }

  getUserFromApi() {
    this.loading = true;

    this.userService.getById(this.user.id)
    .pipe(first())
    .subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
    });

  }

}
