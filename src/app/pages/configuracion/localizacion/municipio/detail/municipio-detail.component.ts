import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { MunicipioService } from 'app/shared/domain/services/configuracion/localizacion/municipio.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-municipio-detail',
  templateUrl: './municipio-detail.component.html',
  styleUrls: ['./municipio-detail.component.scss'],
  animations: appAnimations
})

export class MunicipioDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private municipioService: MunicipioService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.municipioService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
