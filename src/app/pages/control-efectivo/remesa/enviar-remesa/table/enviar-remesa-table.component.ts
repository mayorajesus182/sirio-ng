import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestion-efectivo-reports.service';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-enviar-remesa-table',
  templateUrl: './enviar-remesa-table.component.html',
  styleUrls: ['./enviar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EnviarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'receptor', 'monto', 'moneda', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private gestionEfectivoReportsService: GestionEfectivoReportsService,
    private cdr: ChangeDetectorRef,
    private remesaService: RemesaService,
  ) {
    super(undefined, injector);
  }

  loadList() {
    this.init(this.remesaService, 'remesa_id', 'pagePorDespachar');
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loadList();
  }

  ngAfterViewInit() {
  }

  add(path: string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  override(data: any) {
    this.swalService.show('¿Desea Anular el Envío de Remesa?', data.element.id).then((resp) => {
      if (!resp.dismiss) {
        this.remesaService.cancelShipment(data.element).subscribe(data => {
          this.loadList();
          this.successResponse('La Remesa', 'Anulada', false);
          return data;
        }, error => this.errorResponse(true));
      }
    });
  }

  dispatch(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/dispatch`]);
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }


  print(data: any) {
    let dto = { remesa: data.element.id } as GestionEfectivoReports;
    this.gestionEfectivoReportsService.cartaPorte(dto).subscribe(data => {
      // this.loadingDataForm.next(false);
      const name = this.getFileName(data);
      let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
      this.download(name, blob);
    });
  }
}

