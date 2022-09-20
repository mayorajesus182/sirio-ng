import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { EstadoService } from 'app/shared/domain/services/configuracion/localizacion/estado.service';

import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class EstadoComponent implements OnInit {

  constructor(
    private estadoService: EstadoService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.estadoService.searchTerm.next(term);
  }

}
