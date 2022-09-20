import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { ParroquiaService } from 'app/shared/domain/services/configuracion/localizacion/parroquia.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-parroquia-detail',
  templateUrl: './parroquia-detail.component.html',
  styleUrls: ['./parroquia-detail.component.scss'],
  animations: appAnimations
})

export class ParroquiaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private parroquiaService: ParroquiaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.parroquiaService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
