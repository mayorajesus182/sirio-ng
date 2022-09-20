import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { EstadoService } from 'app/shared/domain/services/configuracion/localizacion/estado.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-estado-detail',
  templateUrl: './estado-detail.component.html',
  styleUrls: ['./estado-detail.component.scss'],
  animations: appAnimations
})

export class EstadoDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private estadoService: EstadoService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.estadoService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
