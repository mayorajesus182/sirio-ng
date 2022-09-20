import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { ParroquiaService } from 'app/shared/domain/services/configuracion/localizacion/parroquia.service';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations   : appAnimations
})
export class ParroquiaComponent implements OnInit {

  constructor(
    private parroquiaService: ParroquiaService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.updateSearchTerm("");
  }

  updateSearchTerm(term: string) {
    this.parroquiaService.searchTerm.next(term);
  }

}
