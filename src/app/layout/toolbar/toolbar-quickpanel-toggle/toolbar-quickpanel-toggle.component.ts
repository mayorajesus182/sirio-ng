import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/@sirio/services/session.service';

@Component({
  selector: 'sirio-toolbar-quickpanel-toggle',
  templateUrl: './toolbar-quickpanel-toggle.component.html',
  styleUrls: ['./toolbar-quickpanel-toggle.component.scss']
})
export class ToolbarQuickpanelToggleComponent {

  @Output() openQuickPanel = new EventEmitter();

  constructor(private router:Router, private sessionService:SessionService) {
  }

  goStatistics(){
    //TODO: ACA DEBO PEDIR EL ROL  Y VER PARA DONDE ME VOY SI AGENCIA O TAQUILLA

    const user = this.sessionService.getUser();

    if (user && user.username && user.rols && user.rols.length > 0) {
      console.log("Usuario", user);
      if(user.rols.include("")){
        this.router.navigate(['/sirio/estadistica/agencia/saldos']);        
      }else if(user.rols.include("")){
        this.router.navigate(['/sirio/estadistica/taquilla/saldos']);
      }
    }
  }
}
