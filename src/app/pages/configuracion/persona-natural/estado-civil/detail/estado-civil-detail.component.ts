import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { EstadoCivilService } from 'src/@sirio/domain/services/configuracion/persona-natural/estado-civil.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-estado-civil-detail',
  templateUrl: './estado-civil-detail.component.html',
  styleUrls: ['./estado-civil-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EstadoCivilDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private estadoCivilService: EstadoCivilService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.estadoCivilService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
