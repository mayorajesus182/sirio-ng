import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { MotivoSolicitudService } from 'src/@sirio/domain/services/configuracion/producto/motivo-solicitud.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-motivo-solicitud-detail',
  templateUrl: './motivo-solicitud-detail.component.html',
  styleUrls: ['./motivo-solicitud-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class MotivoSolicitudDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private motivoSolicitudService: MotivoSolicitudService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.motivoSolicitudService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
