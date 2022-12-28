import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-categoria-especial-detail',
  templateUrl: './categoria-especial-detail.component.html',
  styleUrls: ['./categoria-especial-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CategoriaEspecialDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private categoriaEspecialService: CategoriaEspecialService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.categoriaEspecialService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
