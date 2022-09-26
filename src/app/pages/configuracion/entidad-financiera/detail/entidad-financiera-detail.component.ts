import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { EntidadFinancieraService } from 'src/@sirio/domain/services/configuracion/entidad-financiera.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-entidad-financiera-detail',
  templateUrl: './entidad-financiera-detail.component.html',
  styleUrls: ['./entidad-financiera-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EntidadFinancieraDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private entidadFinancieraService: EntidadFinancieraService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.entidadFinancieraService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
