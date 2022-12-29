import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { NivelEstudioService } from 'src/@sirio/domain/services/configuracion/persona-natural/nivel-estudio.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-nivel-estudio-detail',
  templateUrl: './nivel-estudio-detail.component.html',
  styleUrls: ['./nivel-estudio-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NivelEstudioDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private nivelEstudioService: NivelEstudioService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.nivelEstudioService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
