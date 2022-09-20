import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { ViaService } from 'app/shared/domain/services/configuracion/localizacion/via.service';

import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-via',
  templateUrl: './via.component.html',
  styleUrls: ['./via.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class ViaComponent implements OnInit {

  constructor(
    private viaService: ViaService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.viaService.searchTerm.next(term);
  }

}
