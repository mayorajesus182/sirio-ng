import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { FormaJuridicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/forma-juridica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-forma-juridica-detail',
  templateUrl: './forma-juridica-detail.component.html',
  styleUrls: ['./forma-juridica-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class FormaJuridicaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private formaJuridicaService: FormaJuridicaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.formaJuridicaService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
