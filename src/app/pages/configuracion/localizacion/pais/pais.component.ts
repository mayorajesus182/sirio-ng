import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { PaisService } from 'app/shared/domain/services/configuracion/localizacion/pais.service';

import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class PaisComponent implements OnInit {

  constructor(
    private paisService: PaisService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.paisService.searchTerm.next(term);
  }

}
