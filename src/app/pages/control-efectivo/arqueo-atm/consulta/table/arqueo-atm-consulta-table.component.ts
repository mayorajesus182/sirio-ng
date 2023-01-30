import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { lowerFirst } from 'lodash-es';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { ArqueoAtmReportService } from 'src/@sirio/domain/services/control-efectivo/arqueo-atm.reports.service';
import { ArqueoAtm, ArqueoAtmService } from 'src/@sirio/domain/services/control-efectivo/arqueo-atm.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ArqueoAtmDetailPopupComponent } from '../popup/arqueo-atm-detail-popup.component';


@Component({
  selector: 'app-arqueo-atm-consulta-table',
  templateUrl: './arqueo-atm-consulta-table.component.html',
  styleUrls: ['./arqueo-atm-consulta-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ArqueoAtmConsultaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public arqueoData: ArqueoAtm[];
  public arqueos: ReplaySubject<ArqueoAtm[]> = new ReplaySubject<ArqueoAtm[]>();
  public keywords: string = '';

  moneda: Moneda = {} as Moneda;
  atmId: string;
  atm: string;


  transportista: string;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;


  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private arqueoAtmService: ArqueoAtmService,
    private arqueoAtmReportService: ArqueoAtmReportService,
    private monedaService: MonedaService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.arqueoAtmService.allTodayByAtm(this.atmId).subscribe((data) => {
      console.log(' dataaaaaaaaa   ', data);
      
      this.arqueoData = data;
      this.arqueos.next(data.slice());
    });
  }

  ngOnInit() {

    this.atmId = this.route.snapshot.params['id'];
    const data = history.state.data;

    if (data) {
      this.atm = data.identificacion;
      sessionStorage.setItem('trans_nombre', this.atm);
      sessionStorage.setItem('moneda_atm', data.moneda);
    } else {
      this.atm = sessionStorage.getItem('trans_nombre')
    }

    this.monedaService.get(sessionStorage.getItem('moneda_atm')).subscribe((result: Moneda) => {
      this.moneda = result;
    });

    if (this.atmId) {
      this.loadList();
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  onFilterChange(value) {

    value = value.trim();
    value = value.toLowerCase();

    this.arqueos.next(
      this.arqueoData.filter(item => {
        if (
          item.secuencia &&
          item.secuencia
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 || !value
        ) {

          return true;
        }
      }).slice());
  }


  openPopup(data: any) {

    data.moneda = this.moneda.siglas + ' - ' + this.moneda.nombre;
    data.atm = this.atmId + ' - ' + this.atm;

    this.showFormPopup(ArqueoAtmDetailPopupComponent, data, '80%');

    this.dialogRef.afterClosed().subscribe(event => {
      this.loadList()
    });
  }


  print(data: any) {
    console.log(data);

    // atm
    // :
    // "ATM001"
    // fecha
    // :
    // "24/01/2023"
    // fechaCreacion
    // :
    // "24/01/2023 11:53:55"
    // id
    // :
    // 1
    // monto
    // :
    // 1710
    // montoArqueo
    // :
    // 0
    // montoIncremento
    // :
    // 1710
    // montoRetiro
    // :
    // 0
    // secuencia
    // :
    // 1
    let dto = { atm: data.atm, secuencia:data.secuencia };
    // this.loading.next(true);
    this.arqueoAtmReportService.reporte(dto).subscribe(data => {
      // this.loading.next(false);
      const name = this.getFileName(data);
      let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
      this.download(name, blob);
    });
  }

}

