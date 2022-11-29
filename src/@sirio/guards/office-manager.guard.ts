import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { RolConstants } from "../constants";
import { User } from "../domain/services/security/auth.service";
import { SessionService } from "../services/session.service";
import { SweetAlertService } from "../services/swal.service";

@Injectable()
export class OfficeManagerGuard implements CanActivate {

  constructor(
    private router: Router, 
    private swalService: SweetAlertService,
    private userSession: SessionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const u = this.userSession.getUser() as User;
    if (u) {
      if (!u.rols.includes(RolConstants.GERENTE_TESORERO_AGENCIA)) {

        this.swalService.show('message.notBoxOfficeTitle', 'message.notBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
          if (!resp.dismiss) {
            this.router.navigate(['/sirio/welcome']);
          }

        });
        return false;

      } 

      return true;
    }
    return false;
  }
}
