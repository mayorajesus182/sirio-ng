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
  selector: 'app-procesar-remesa-table',
  templateUrl: './procesar-remesa-table.component.html',
  styleUrls: ['./procesar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ProcesarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'emisor', 'monto', 'moneda', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;
  gestionEfectivoReports: GestionEfectivoReports = {} as GestionEfectivoReports;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private gestionEfectivoReportsService: GestionEfectivoReportsService,
    private remesaService: RemesaService,
  ) {
    super(undefined, injector);
  }

  loadList() {
    this.init(this.remesaService, 'remesa_id', 'pagePorProcesar');
  }

  ngOnInit() {
    this.loadList();
  }

  ngAfterViewInit() {
  }

  process(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/process`]);
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


  // reportPdf(){
  //   // this.saldoAgenciaReports.agencia = this.agencia_curr;
  //   this.loadingDataForm.next(true);
  //   (this.agencia_curr?  this.agenciaReport.reportResumenByAgencia(this.saldoAgenciaReports): this.agenciaReport.reportResumen() ).subscribe(data => {
  //     this.loadingDataForm.next(false);
  //     console.log('response:', data);
  //     const name = this.getFileName(data);
  //     let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
  //     this.download(name, blob);
  //   });
  // }





}




