import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthCredentials } from '../models/auth-credentials.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { first, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

// import { CookieService } from 'ngx-cookie-service';

// import { environment } from '@env/environment';
// import { AuthCredentials } from '@app/shared/models/authCredentials.model';
// import { User } from '@app/shared/models/user.model';
// import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private router: Router,
    // private cookieService: CookieService,
    // private stateService: StateService
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  jwtHelper: JwtHelperService;

  get isAuthenticated () {
    const token = localStorage.getItem('token');
    const isExpired = this.jwtHelper.isTokenExpired(token);
    return token && !isExpired  ? true : false;
  }

  get role () {
    const token = localStorage.getItem('token');
    const role = this.jwtHelper.decodeToken(token).role;
    return role;
  }

  register$ (email: string) {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, email);
  }

  login$ (credentials: AuthCredentials): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(first())
      .pipe(map((user: User) => {
        if (user && user.token) {
          localStorage.setItem('token', user.token);
        }
        return user;
      }));
  }

  logout$(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(first())
      .pipe(tap(() => localStorage.removeItem('token')));
  }

  // login$(authCredentials: AuthCredentials): Observable<User> {
  //   return this.http.post<User>(environment.localApiUrl + '/Auth/login', authCredentials)
  //     .pipe(first())
  //     .pipe(tap(() => { this.stateService.reset(); }))
  //     .pipe(map(user => {
  //       // login successful if there's a jwt token in the response
  //       if (user && user.token) {
  //         // store user details and jwt token in local storage to keep user logged in between page refreshes
  //         this.cookieService.set('token', user.token);
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //       }
  //       return user;
  //     }));
  // }

  // logout(): void {
  //   // remove user from local storage to log user out
  //   localStorage.removeItem('currentUser');
  //   this.router.navigate(['/login']);
  // }

  // forgotPasswordRequest$(email: ForgotPasswordRequest): Observable<any> {
  //   return this.http.post<any>(environment.localApiUrl + '/Auth/forgotPasswordRequest', email)
  //     .pipe(first());
  // }

  // resetPassword(request: PasswordResetRequest): Observable<IdentityResult> {
  //   return this.http.post<IdentityResult>(environment.localApiUrl + '/Auth/resetPassword', request)
  //     .pipe(first());
  // }

  // resetPasswordWithToken(request: ResetForgottenPasswordRequest): Observable<IdentityResult> {
  //   return this.http.post<IdentityResult>(environment.localApiUrl + '/Auth/resetForgottenPassword', request)
  //     .pipe(first());
  // }

  // MOCKED SERVICE CALLS

  // mockLogin$(credentials: AuthCredentials): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => {
  //       console.log(credentials);
  //       observer.next();
  //       observer.complete();
  //     }, 1000);
  //   });
  // }

  // mockLogout$(): void {
  //   this.router.navigate(['login']);
  // }

  // mockForgotPassword$(email: ForgotPasswordRequest): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => console.log(email), 1000);
  //     observer.complete();
  //   });
  // }

  // mockResetPassword$(request: PasswordResetRequest): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => console.log(request), 1000);
  //     observer.complete();
  //   });
  // }

  // mockResetPasswordWithToken$(request: ResetForgottenPasswordRequest): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => console.log(request), 1000);
  //     observer.complete();
  //   });
  // }
}
