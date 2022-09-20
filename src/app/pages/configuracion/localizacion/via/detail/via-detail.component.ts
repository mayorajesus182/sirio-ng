import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { ViaService } from 'app/shared/domain/services/configuracion/localizacion/via.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-via-detail',
  templateUrl: './via-detail.component.html',
  styleUrls: ['./via-detail.component.scss'],
  animations: appAnimations
})

export class ViaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private viaService: ViaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.viaService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
