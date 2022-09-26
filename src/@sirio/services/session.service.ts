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

  constructor(

    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private snack: SnackbarService
  ) {

  }

  isLockScreen() {
    
    return localStorage[SessionService.SESSION_STATUS] !=undefined && localStorage[SessionService.SESSION_STATUS] == SessionService.STATUS_LOCKED;
  }

  isLoggedIn() {
    return this.jwtService.getToken() && !this.isLockScreen();
  }

  get(): String {
    return localStorage[SessionService.SESSION_STATUS];
  }

  getUser(): any {
    if (!localStorage.getItem(SessionService.USER)) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem(SessionService.USER));
  }


  save(status: string) {
    localStorage.setItem(SessionService.SESSION_STATUS, status);
  }

  destroy() {
    localStorage.removeItem(SessionService.SESSION_STATUS);
    this.authService.purgeAuth();
  }

  lockscreen() {
    const user = this.getUser();

    localStorage.setItem('user-locked', JSON.stringify({ username: user.username, fullName: user.fullName }));
    localStorage[SessionService.SESSION_STATUS] = SessionService.STATUS_LOCKED;

    this.authService.lockscreen().subscribe(
      data => {
        // this.router.navigateByUrl('/views/session/lock');
        this.router.navigate(['/user/locked'])
      },
      err => {
        //console.log('error ',err.error);
        this.destroy();
        this.snack.show({ message: 'Problemas para bloquear la sesión!', type: 'danger' });

      }
    );
  }

  logout() {

    this.authService.logOut().subscribe(
      data => {
        this.destroy();
        this.router.navigate(['/user/login']);
        //TODO: DEBO LLAMAR A TRANSLATE ACA
        this.snack.show({ message: 'Sesión cerrada satisfactoriamente!', horizontalPosition: 'right' });
      },
      err => {
        this.destroy()
        //console.log('error ',err.error);
        this.snack.show({ message: 'Problemas para cerrar la sesión!', type: 'danger' });

      }
    );
  }

}
