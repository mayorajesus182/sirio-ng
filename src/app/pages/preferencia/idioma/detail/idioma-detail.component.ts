import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { IdiomaService } from 'src/@sirio/domain/services/preferencias/idioma.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'sirio-idioma-detail',
  templateUrl: './idioma-detail.component.html',
  styleUrls: ['./idioma-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class IdiomaDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private idiomaService: IdiomaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.idiomaService.detail(id).subscribe(data => {
      console.log('view idioma ',data);
      
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
