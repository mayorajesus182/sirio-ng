import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-pase-efectivo-detail',
  templateUrl: './pase-efectivo-detail.component.html',
  styleUrls: ['./pase-efectivo-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseEfectivoDetailComponent extends FormBaseComponent implements OnInit {

  public conos: ConoMonetario[] = [];

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private bovedaAgenciaService: BovedaAgenciaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.bovedaAgenciaService.detail(id).subscribe(data => {
      this.data = data;

      // TODO: AGREGAR ETIQUETAS FALTANTES EN EL HTML


      this.conos = data.detalleEfectivo;

      this.loadingDataForm.next(false);
    });

  }

}
