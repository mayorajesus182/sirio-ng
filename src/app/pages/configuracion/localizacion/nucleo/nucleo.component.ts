import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { NucleoService } from 'app/shared/domain/services/configuracion/localizacion/nucleo.service';

import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-nucleo',
  templateUrl: './nucleo.component.html',
  styleUrls: ['./nucleo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class NucleoComponent implements OnInit {

  constructor(
    private nucleoService: NucleoService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.nucleoService.searchTerm.next(term);
  }

}
