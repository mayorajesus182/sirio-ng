import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConstants } from 'src/@sirio/constants';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegionService } from 'src/@sirio/domain/services/organizacion/region.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-atm-detail',
  templateUrl: './atm-detail.component.html',
  styleUrls: ['./atm-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AtmDetailComponent extends FormBaseComponent implements OnInit {

  remoto = GlobalConstants.REMOTO;

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private regionService: RegionService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.regionService.detail(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}