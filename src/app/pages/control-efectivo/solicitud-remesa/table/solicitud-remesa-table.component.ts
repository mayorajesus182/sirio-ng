import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { SolicitudRemesaService } from 'src/@sirio/domain/services/control-efectivo/solicitud-remesa.service copy';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-solicitud-remesa-table',
  templateUrl: './solicitud-remesa-table.component.html',
  styleUrls: ['./solicitud-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitudRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['solremesa_id', 'transportista_id', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private solicitudRemesaService: SolicitudRemesaService,
    private taquillaService: TaquillaService,
  ) {
    super(undefined, injector);
  }

  ngOnInit() {
      this.init(this.solicitudRemesaService, 'solremesa_id');
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
    this.applyChangeStatus(this.solicitudRemesaService, data.element, data.element.nombre, this.cdr);
  }

}

