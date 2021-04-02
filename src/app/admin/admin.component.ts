import { Component, OnInit } from '@angular/core';
import { User } from '@app/models';
import { UserService } from '@app/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  loading = false;
  users: User[] = [];

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.loading = true;
    this.userService.getAll().pipe(first())
    .subscribe(users => {
        this.loading = false;
        this.users = users;
    });
  }

}
