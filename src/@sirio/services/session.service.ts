import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from '../domain/services/security/auth.service';
import { JwtService } from './jwt.service';
import { SnackbarService } from './snackbar.service';




@Injectable({
  providedIn: 'root',
})
export class SessionService {

  public static SESSION_STATUS = 'session_status';
  public static STATUS_LOCKED = 'lockscreen';
  public static USER = 'user';
  public static USER_LOCKED = 'user-locked';
  private success = 'message.successfulLogout';
  private error = 'message.logoutError';
  constructor(

    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private snack: SnackbarService,
  ) {

    // this.translate.get('message.successfulLogout').subscribe(txt=>{
    //   this.success=txt;
    //  });

    //  this.translate.get('message.logoutError').subscribe(txt=>{
    //   this.error=txt;
    //  });


  }

  isLockScreen() {

    return localStorage[SessionService.SESSION_STATUS] != undefined && localStorage[SessionService.SESSION_STATUS] == SessionService.STATUS_LOCKED;
  }

  isLoggedIn() {
    return this.jwtService.getToken() ;
  }

  get(): String {
    return localStorage[SessionService.SESSION_STATUS];
  }

  getUser(): any {
    if (!localStorage.getItem(SessionService.USER)) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem(SessionService.USER)) || JSON.parse(localStorage.getItem(SessionService.USER_LOCKED));
  }


  save(status: string) {
    localStorage.setItem(SessionService.SESSION_STATUS, status);
  }

  destroy() {
    localStorage.removeItem(SessionService.SESSION_STATUS);
    this.authService.purgeAuth();
  }

  reset() {
    localStorage.removeItem(SessionService.SESSION_STATUS);
    localStorage.removeItem(SessionService.USER_LOCKED);
    
  }

  lockscreen() {
    if(this.isLockScreen()){
      return;
    }
    const user = this.getUser();

    localStorage.setItem(SessionService.USER_LOCKED, JSON.stringify({ username: user.username, fullName: user.fullName }));

    this.authService.lockscreen().subscribe(
      data => {
        localStorage[SessionService.SESSION_STATUS] = SessionService.STATUS_LOCKED;
        
        this.router.navigate(['/user/locked'])
      },
      err => {
        //console.log('error ',err.error);
        this.destroy();
        this.snack.show({ message: '!Problemas para bloquear la sesión!', type: 'danger' });

      }
    );
  }

  logout() {

    this.authService.logOut().subscribe(
      data => {
        this.destroy();
        this.router.navigate(['/user/login']);
        //TODO: DEBO LLAMAR A TRANSLATE ACA
        this.snack.show({ message: this.success, horizontalPosition: 'center' });
      },
      err => {
        this.destroy()
        //console.log('error ',err.error);
        this.snack.show({ message: this.error, type: 'danger' });

      }
    );
  }

}
