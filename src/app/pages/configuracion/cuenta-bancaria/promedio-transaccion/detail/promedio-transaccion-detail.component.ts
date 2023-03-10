import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { PromedioTransaccionService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/promedio-transaccion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-promedio-transaccion-detail',
  templateUrl: './promedio-transaccion-detail.component.html',
  styleUrls: ['./promedio-transaccion-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PromedioTransaccionDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private promedioTransaccionService: PromedioTransaccionService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.promedioTransaccionService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
