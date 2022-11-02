import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-agencia-detail',
  templateUrl: './agencia-detail.component.html',
  styleUrls: ['./agencia-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AgenciaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private agenciaService: AgenciaService) {
    super(undefined, injector);
  }

  // TODO: REVISAR ETIQUETAS DE LA PANTALLA
  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.agenciaService.detail(id).subscribe(data => {     
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }
}
