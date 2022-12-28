import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-tipo-documento-detail',
  templateUrl: './tipo-documento-detail.component.html',
  styleUrls: ['./tipo-documento-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoDocumentoDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private tipoDocumentoService: TipoDocumentoService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.tipoDocumentoService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
