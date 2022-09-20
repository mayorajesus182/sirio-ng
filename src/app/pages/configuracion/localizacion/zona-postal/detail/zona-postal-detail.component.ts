import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { ZonaPostalService } from 'app/shared/domain/services/configuracion/localizacion/zona.postal.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-zona-postal-detail',
  templateUrl: './zona-postal-detail.component.html',
  styleUrls: ['./zona-postal-detail.component.scss'],
  animations: appAnimations
})

export class ZonaPostalDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private zonaPostalService: ZonaPostalService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.zonaPostalService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }
}
