import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Login } from '@app/core/store/auth/auth.actions';
import { User } from '@app/core/models/user.model';
import { AppState } from '@app/core/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store<AppState.State>
  ) {}

  form: FormGroup;

  ngOnInit() {
    this.createFormGroup();
  }

  createFormGroup(): void {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', Validators.email),
      password: this.formBuilder.control('')
    });
  }

  login() {
    this.authenticationService
      .login$(this.form.value)
      .pipe(
        tap((user: User) => {
          this.store.dispatch(new Login(user));
        })
      )
      .subscribe(response => {
        this.router.navigate(['/articles']);
      });
  }

  toRegister() {
    this.router.navigate(['/account/register']);
  }
}
