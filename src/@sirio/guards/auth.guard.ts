import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SessionService } from "../services/session.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userSession: SessionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userSession.isLoggedIn()) {
      console.log('user is logged');      
      return true;
    } else {
      console.log('user is not logged');
      this.router.navigate(["/user/login"]);
      
        // queryParams: {
        //   return: state.url
        // }
      return false;
    }
  }
}
