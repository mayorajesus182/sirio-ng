import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-pase-boveda-detail',
  templateUrl: './pase-boveda-detail.component.html',
  styleUrls: ['./pase-boveda-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseABovedaDetailComponent extends FormBaseComponent implements OnInit {

  public conos: ConoMonetario[] = [];

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private cajaTaquillaService: CajaTaquillaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.cajaTaquillaService.detail(id).subscribe(data => {
      this.data = data;
      this.conos = data.detalleEfectivo;
      this.loadingDataForm.next(false);
    });

  }

}
