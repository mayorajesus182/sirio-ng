import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-aprobar-remesa-table',
  templateUrl: './aprobar-remesa-table.component.html',
  styleUrls: ['./aprobar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AprobarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'emisor', 'receptor', 'monto', 'moneda', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private remesaService: RemesaService,
  ) {
    super(undefined, injector);
  }

  loadList() {
    this.init(this.remesaService, 'remesa_id', 'pagePorAprobar');
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loadList();
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  approve(data: any) {
    this.swalService.show('¿Desea Aprobar la Solicitud?', data.element.id).then((resp) => {
      if (!resp.dismiss) {
        this.remesaService.approve(data.element.id).subscribe(data => {
          this.successResponse('La Remesa', 'Aprobada', false);
          this.loadList();
          return data;
        }, error => this.errorResponse(true));
      }
    });
  }

  override(data: any) {
    this.swalService.show('¿Desea Anular la Solicitud?', data.element.id).then((resp) => {
      if (!resp.dismiss) {
        this.remesaService.cancelRequest(data.element).subscribe(data => {
          this.loadList();
          this.successResponse('La Remesa', 'Anulada', false);
          return data;
        }, error => this.errorResponse(true));
      }
    });
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

}

