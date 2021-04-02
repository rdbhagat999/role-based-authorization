import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private readonly formBuilder: FormBuilder, private readonly route: ActivatedRoute, private readonly router: Router, private readonly authService: AuthService) {
    // redirect to home if already logged in
    if (this.authService?.userValue) {
        this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      username: ['user', Validators.required],
      password: ['user', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.f?.username?.value, this.f?.password?.value)
      .pipe(first())
      .subscribe(
        () => {
          // get return url from query parameters or default to home page
          const returnUrl = this.route?.snapshot?.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }

}
