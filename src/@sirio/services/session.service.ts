import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../domain/services/security/auth.service';
import { JwtService } from './jwt.service';
import { SnackbarService } from './snackbar.service';




@Injectable({
  providedIn: 'root',
})
export class SessionService {

  constructor(

    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private snack: SnackbarService
  ) {

  }

  isLockScreen() {
    
    return localStorage['sessionState'] !=undefined && localStorage['sessionState'] == 'LOCK-SCREEN';
  }

  isLoggedIn() {
    return this.jwtService.getToken() && !this.isLockScreen();
  }

  get(): String {
    return localStorage['sessionState'];
  }

  getUser(): any {
    if (!localStorage.getItem('user')) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem('user'));
  }

  user(): Observable<any> {

    return this.authService.user;
  }

  save(status: string) {
    localStorage.setItem('sessionState', status);
  }

  destroy() {
    localStorage.removeItem('sessionState');
    this.authService.purgeAuth();
  }

  lockscreen() {
    const user = this.authService.getCurrentUser();

    // localStorage.setItem('currentUser', JSON.stringify({ username: user.username, fullName: user.fullName }));
    localStorage['sessionState'] = 'LOCK-SCREEN';

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
