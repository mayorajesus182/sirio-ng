import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-pase-boveda-table',
  templateUrl: './pase-boveda-table.component.html',
  styleUrls: ['./pase-boveda-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseABovedaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['cajtaquilla_id', 'tipoMovimiento', 'monto', 'moneda', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private cajaTaquillaService: CajaTaquillaService,
    private taquillaService: TaquillaService,
  ) {
    super(undefined, injector);
  }

  ngOnInit() {

    this.taquillaService.isOpen().subscribe(isOpen => {
      // if (isOpen) {
      this.isOpen = isOpen;


        this.init(this.cajaTaquillaService, 'cajtaquilla_id');



      // } else {
      //   this.router.navigate(['/sirio/welcome']);
      //   this.swalService.show('message.closedBoxOfficeTitle', 'message.closedBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
      //     if (!resp.dismiss) {}
      //   });
      // }


    });
  }

  ngAfterViewInit() {
  //  this.afterInit();
  }


  add(path: string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data: any) {
    this.applyChangeStatus(this.cajaTaquillaService, data.element, data.element.nombre, this.cdr);
  }

}

