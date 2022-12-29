import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-remesa-detail',
  templateUrl: './remesa-detail.component.html',
  styleUrls: ['./remesa-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RemesaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private route: ActivatedRoute,
    private remesaService: RemesaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.remesaService.detail(id).subscribe(data => {

      console.log('  data   ', data);
      

      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
