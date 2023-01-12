import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RolConstants } from 'src/@sirio/constants';
import { SessionService } from 'src/@sirio/services/session.service';

@Component({
  selector: 'sirio-toolbar-statics-toggle',
  templateUrl: './toolbar-statics-toggle.component.html',
  styleUrls: ['./toolbar-statics-toggle.component.scss']
})
export class ToolbarQuickpanelToggleComponent {

  @Output() openQuickPanel = new EventEmitter();

  constructor(private router:Router, private sessionService:SessionService) {
  }

  goStatistics(){

    const user = this.sessionService.getUser();
//TODO: PONER PARA CUANDO TRATE EL ROL && user.rols && user.rols.length > 0
    if (user && user.username ) {
      console.log("Usuario ROLS", user);
      if(user.rols.includes(RolConstants.GERENTE_TESORERO_AGENCIA)){
        this.router.navigate(['/sirio/estadistica/agencia/saldos']);        
      }else if(user.rols.includes(RolConstants.OPERADOR_TAQUILLA)){
        this.router.navigate(['/sirio/estadistica/taquilla/saldos']);
      }else if(user.rols.includes(RolConstants.GERENTE_REGIONAL)){
        this.router.navigate(['/sirio/estadistica/region/saldos']);
      } else if(user.rols.includes(RolConstants.PRINCIPAL)){
        this.router.navigate(['/sirio/estadistica/principal/saldos']);
      }else if(user.rols.includes(RolConstants.TRANSPORTISTA)){
        this.router.navigate(['/sirio/estadistica/transportista/saldos']);
      }
    }
  }
}
