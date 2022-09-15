import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


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
  timeout?: number;
  darkMode?: boolean;
  position?: string;

}

@Injectable(
  {
    providedIn: 'root',
  }
)
export class AuthService {
  private apiConfig: ApiOption;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
  ) {
    //console.log('instance authservice');

    this.apiConfig = { name: ApiConfConstants.API_AUTH, prefix: '/session' };

    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();

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

    // this.jwtService.saveToken(user.token.access_token);
    localStorage.setItem('user', JSON.stringify(user));
    // Set current user data into observable
    //this.populate();
    this.userSubject.next(user);
    // window.localStorage['dark_mode'] = user.darkMode;
    //this.themeService.toggleDarkMode(user.darkMode);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

  }


  getCurrentUser(): User {
    //console.log(' user subject ',this.currentUserSubject);

    return this.userSubject.value;
  }


  purgeAuth() {
    // Remove JWT from localstorage
    //console.log('purg user ',this.getCurrentUser());

    // this.jwtService.destroyToken();
    // Set current user to an empty object
    this.userSubject.next({} as User);
    localStorage.removeItem('user');
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

    return this.apiService.config(this.apiConfig).get('/lockscreen')
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

    return this.apiService.config({ name: ApiConfConstants.API_AUTH, prefix: undefined }).post('/public/unlockscreen', credentials)
      .pipe(map(
        (data: User) => {
          // console.log('unlock session by ',data);

          this.setAuth(data);
          return data;
        }
      ));
  }
  


}
