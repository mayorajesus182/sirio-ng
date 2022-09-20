import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { ZonaPostalService } from 'app/shared/domain/services/configuracion/localizacion/zona.postal.service';

import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-zona-postal',
  templateUrl: './zona-postal.component.html',
  styleUrls: ['./zona-postal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class ZonaPostalComponent implements OnInit {

  constructor(
    private zonaPostalService: ZonaPostalService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.zonaPostalService.searchTerm.next(term);
  }

}
