import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { TipoServicioService } from 'src/@sirio/domain/services/configuracion/servicio-comercial.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-tipo-servicio-detail',
  templateUrl: './tipo-servicio-detail.component.html',
  styleUrls: ['./tipo-servicio-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoServicioDetailComponent extends FormBaseComponent implements OnInit {

  constants = GlobalConstants;

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private tipoServicioService: TipoServicioService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.tipoServicioService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
