import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';
import { JwtService } from 'src/@sirio/services/jwt.service';
import { SessionService } from 'src/@sirio/services/session.service';


export interface TokeSession {
  access_token: string;
}

export interface User {
  email?: string;
  token?: TokeSession;
  username?: string;
  fullName?: string;
  prevLogin?: any;
  organization?: string;
  organizationId?: string
  position?: string;
}

@Injectable(
  {
    providedIn: 'root',
  }
)
export class AuthService {
  private apiConfig: ApiOption;

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private jwtService: JwtService,
    private apiService: ApiService,
  ) {
    //console.log('instance authservice');

    this.apiConfig = { name: ApiConfConstants.API_AUTH, prefix: '/session' };


  }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    
    // if (this.jwtService.getToken()) {
    //   this.apiService.config(this.apiConfig).get('/user')
    //     .subscribe(
    //       data => {
    //         // Set current user data into observable
    //         // this.userSubject.next(data);
    //         // Set isAuthenticated to true
    //         // this.isAuthenticatedSubject.next(true);
    //         this.setAuth(data);
    //       },
    //       err => this.purgeAuth()
    //     );
    // } else {
    //   this.purgeAuth();
    // }
  }

  get(): Observable<any> {

    return this.apiService.config(this.apiConfig).get('/user/get');
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    console.log('user auth ', user);

    this.jwtService.saveToken(user.token.access_token);
    localStorage.setItem(SessionService.USER, JSON.stringify(user));
    // Set current user data into observable
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

  }

  purgeAuth() {
    // Remove JWT from localstorage

    this.jwtService.destroyToken();
    localStorage.removeItem(SessionService.USER);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    // this.userIdle.stop();


  }

  attemptAuth(credentials:any): Observable<User> {

    return this.apiService.config({ name: ApiConfConstants.API_AUTH, prefix: undefined }).post('/public/login', credentials)
      .pipe(map(
        (data: User) => {
          this.setAuth(data);
          return data;
        }
      ));
  }

  logOut(): Observable<any> {

    return this.apiService.config(this.apiConfig).get('/logout')
      .pipe(map(
        data => {
          // //console.log('logout session ', data);

          this.purgeAuth();
          return data;
        }
      ));
  }


  toggleDarkMode() {

    // return this.apiService.config(this.apiConfig).get('/darkmode/update');
  }

  lockscreen(): Observable<any> {

    return this.apiService.config(this.apiConfig).get('/lock')
      .pipe(map(
        data => {
          //console.log('lockscreen session ', data);
          // Remove JWT from localstorage
          // this.jwtService.destroyToken();
          //this.sessionStatusService.saveByUser('lockscreen',this.getCurrentUser().data.username);
          return data;
        }
      ));
  }



  unLockscreen(credentials): Observable<User> {

    return this.apiService.config({ name: ApiConfConstants.API_AUTH, prefix: undefined }).post('/public/session/unlock', credentials)
      .pipe(map(
        (data: User) => {
          console.log('unlock session by ',data);

          this.setAuth(data);
          return data;
        }
      ));
  }
  


}
