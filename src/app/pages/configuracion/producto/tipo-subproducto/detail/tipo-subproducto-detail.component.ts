import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-tipo-subproducto-detail',
  templateUrl: './tipo-subproducto-detail.component.html',
  styleUrls: ['./tipo-subproducto-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoSubproductoDetailComponent extends FormBaseComponent implements OnInit {

  constants = GlobalConstants;

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private tipoSubproductoService: TipoSubproductoService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.tipoSubproductoService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
