import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SessionService } from "../services/session.service";
import { SweetAlertService } from "../services/swal.service";

@Injectable()
export class BoxOfficeGuard implements CanActivate {

  constructor(
    private router: Router,
    private swalService: SweetAlertService,
    private userSession: SessionService) { }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const u = this.userSession.getUser();
    if (u) {
      console.log('user logged boxoffice ', u);

      if (!u.taquillaAsigned) {

        this.swalService.show('message.notBoxOfficeTitle', 'message.notBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
          if (!resp.dismiss) {
            this.router.navigate(['/sirio/welcome']);
          }

        });
        return false;

      } 

      return true;
    }
  }
}
