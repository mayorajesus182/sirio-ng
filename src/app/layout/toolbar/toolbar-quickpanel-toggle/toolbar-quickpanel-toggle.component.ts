import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sirio-toolbar-quickpanel-toggle',
  templateUrl: './toolbar-quickpanel-toggle.component.html',
  styleUrls: ['./toolbar-quickpanel-toggle.component.scss']
})
export class ToolbarQuickpanelToggleComponent {

  @Output() openQuickPanel = new EventEmitter();

  constructor(private router:Router) {
  }

  goStatistics(){
    //TODO: ACA DEBO PEDIR EL ROL  Y VER PARA DONDE ME VOY SI AGENCIA O TAQUILLA
    this.router.navigate(['/sirio/estadistica/agencia/saldos']);
  }
}
