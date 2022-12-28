import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { DestinoCuentaService } from 'src/@sirio/domain/services/configuracion/producto/destino-cuenta.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-destino-cuenta-detail',
  templateUrl: './destino-cuenta-detail.component.html',
  styleUrls: ['./destino-cuenta-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DestinoCuentaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private destinoCuentaService: DestinoCuentaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.destinoCuentaService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
