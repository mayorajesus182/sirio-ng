import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ActividadIndependienteService } from 'src/@sirio/domain/services/configuracion/persona-natural/actividad-independiente.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-actividad-independiente-detail',
  templateUrl: './actividad-independiente-detail.component.html',
  styleUrls: ['./actividad-independiente-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ActividadIndependienteDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private actividadIndependienteService: ActividadIndependienteService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.actividadIndependienteService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
