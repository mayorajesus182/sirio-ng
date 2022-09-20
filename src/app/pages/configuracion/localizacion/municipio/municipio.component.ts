import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { MunicipioService } from 'app/shared/domain/services/configuracion/localizacion/municipio.service';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class MunicipioComponent implements OnInit {

  constructor(
    private municipioService: MunicipioService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.municipioService.searchTerm.next(term);
  }

}
