import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoTelefonoService } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefono.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-tipo-telefono-detail',
  templateUrl: './tipo-telefono-detail.component.html',
  styleUrls: ['./tipo-telefono-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoTelefonoDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private tipoTelefonoService: TipoTelefonoService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.tipoTelefonoService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }

}
