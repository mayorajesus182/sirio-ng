import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { NucleoService } from 'app/shared/domain/services/configuracion/localizacion/nucleo.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nucleo-detail',
  templateUrl: './nucleo-detail.component.html',
  styleUrls: ['./nucleo-detail.component.scss'],
  animations: appAnimations
})

export class NucleoDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private nucleoService: NucleoService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.nucleoService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
