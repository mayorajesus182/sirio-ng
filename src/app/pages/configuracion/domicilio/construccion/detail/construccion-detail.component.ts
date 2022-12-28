import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConstruccionService } from 'src/@sirio/domain/services/configuracion/domicilio/construccion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-construccion-detail',
  templateUrl: './construccion-detail.component.html',
  styleUrls: ['./construccion-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ConstruccionDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private construccionService: ConstruccionService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.construccionService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }

}
