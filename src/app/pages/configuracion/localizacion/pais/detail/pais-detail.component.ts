import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { PaisService } from 'app/shared/domain/services/configuracion/localizacion/pais.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pais-detail',
  templateUrl: './pais-detail.component.html',
  styleUrls: ['./pais-detail.component.scss'],
  animations: appAnimations
})

export class PaisDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private paisService: PaisService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.paisService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
