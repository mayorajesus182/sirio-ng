import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoArqueoConstants } from 'src/@sirio/constants/tipo.arqueo.constants';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { ArqueoAtm, ArqueoAtmService, DetalleArqueo } from 'src/@sirio/domain/services/control-efectivo/arqueo-atm.service';
import { AtmService, Atm } from 'src/@sirio/domain/services/organizacion/atm.service';
import { Cajetin, CajetinService } from 'src/@sirio/domain/services/organizacion/cajetin.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-arqueo-atm-form',
  templateUrl: './arqueo-atm-form.component.html',
  styleUrls: ['./arqueo-atm-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ArqueoAtmFormComponent extends FormBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public cajetines: ReplaySubject<DetalleArqueo[]> = new ReplaySubject<DetalleArqueo[]>();
  public conos: ConoMonetario[] = [];
  public keywords: string = '';
  atmSeleccionado: Atm = {} as Atm;
  arqueoAtm: ArqueoAtm = {} as ArqueoAtm;
  moneda: Moneda = {} as Moneda;
  atmId: string;
  atm: string;
  montoRow: number = 0;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;
  existsError: boolean = false;
  message: string = '';
  errorList = [];

  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private cajetinService: CajetinService,
    private arqueoAtmService: ArqueoAtmService,
    private monedaService: MonedaService,
    private atmService: AtmService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.arqueoAtmService.getTop(this.atmId).subscribe((data) => {
      this.cajetines.next(data.detalles);
      this.arqueoAtm = data
    });
  }

  ngOnInit() {

    this.atmId = this.route.snapshot.params['id'];
    this.isNew = true;
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

      this.atmService.get(this.atmId).subscribe(data => {
        this.atmSeleccionado = data;
      });

      this.loadList();
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  update(current: Cajetin, event) {
    this.btnState = true;

    this.cajetinService.update(current).subscribe(data => {
      this.btnState = false;
      this.successResponse('El Registro se', 'Actualizó')
    }, err => {
      this.btnState = false;
      this.errorResponse(undefined, false)
    });
  }


  updateValuesErrors(row: any, index) {
    
    row.sobrante = 0;
    row.faltante = 0;
    row.actual = 0;

    if (row.anterior < row.dispensado + row.rechazado) {
      this.message = row.descripcion + ': La Cantidad Dispensada más la Cantidad Rechazada no puede ser mayor al Contador Anterior';
    } else if (row.anterior == 0 && row.fisico > 0) {
      this.message = row.descripcion + ': Sin Contador Anterior no puede existir una Físico';
    } else if (row.fisico > 0 && row.retiro > row.fisico) {
      this.message = row.descripcion + ': La Cantidad a Retirar no puede superar a la Cantidad Disponible en el ATM';
    } else if ((row.fisico == 0 || !row.fisico) && row.retiro > row.anterior - row.dispensado + row.rechazado) {
      this.message = row.descripcion + ': La Cantidad a Retirar no puede superar a la Cantidad Disponible en el ATM';
    } else if (row.fisico > row.anterior) {
      this.message = row.descripcion + ': La Cantidad Física no puede ser superior al Contador Anterior';
    } else {

      this.message = undefined;

      if (row.fisico == undefined || row.fisico == 0) {
        row.sobrante = Math.abs(((row.anterior - row.dispensado)) < 0 ? ((row.anterior - row.dispensado)) : 0);
        row.faltante = Math.abs(((row.anterior - row.dispensado)) > 0 ? ((row.anterior - row.dispensado)) : 0);
        row.actual = row.anterior - row.dispensado + row.incremento - row.retiro;
      } else {
        row.sobrante = Math.abs(((row.anterior - row.dispensado) - row.fisico) < 0 ? ((row.anterior - row.dispensado) - row.fisico) : 0);
        row.faltante = Math.abs(((row.anterior - row.dispensado) - row.fisico) > 0 ? ((row.anterior - row.dispensado) - row.fisico) : 0);
        row.actual = row.fisico + row.incremento - row.retiro;
      }

      // Aca se recorren los cajetines para verificar la cantidad máxima de cada uno
      this.atmSeleccionado.cajetines.filter(c => {
        if (c.id == row.cajetin && row.actual > c.cantidad) { 
          this.message = row.descripcion + ': Excedió la Cantidad Máxima para el Cajetín (Máx. '+c.cantidad+')';
      } })

      row.monto = row.actual * row.denominacion;
      this.arqueoAtm.monto = this.arqueoAtm.detalles.map(e => (e.denominacion * e.actual)).reduce((a, b) => a + b);
    }

    // Indico el Error
    this.errorList[index] = this.message;

    // Se verifica si existe algún mensaje de error, si no existe se habilita el botón de guardar
    this.existsError = false;
    this.errorList.filter (e => { if (e != undefined) this.existsError = true; });

  }


  esIncrementoEvent(event) {
    if (event.checked) {
      this.arqueoAtm.esRetiroAtm = false;
      this.arqueoAtm.detalles.forEach((row, rowIndex) => {
        row.retiro = 0;
        this.updateValuesErrors(row, rowIndex);
      });
    }
  }

  esRetiroEvent(event) {
    if (event.checked) {
      this.arqueoAtm.esIncrementoAtm = false;
      this.arqueoAtm.detalles.forEach((row, rowIndex) => {
        row.incremento = 0;
        this.updateValuesErrors(row, rowIndex);
      });
    }
  }

  save() {
    this.arqueoAtm.atm = this.atmId;
    this.arqueoAtm.tipoArqueo = TipoArqueoConstants.CHEQUEO;
    // this.saveOrUpdate(this.arqueoAtmService, this.arqueoAtm, 'El Arqueo', this.isNew);
    // this.back();
    this.swalService.show('¿Desea Realizar el Arqueo del ATM?', this.atmId + ' - ' + this.atm).then((resp) => {
      if (!resp.dismiss) {
        this.arqueoAtmService.save(this.arqueoAtm).subscribe(data => {
          this.successResponse('El Arqueo', 'Realizado', false);
          return data;
        }, error => this.errorResponse(true));
      }
    });
  }

}

