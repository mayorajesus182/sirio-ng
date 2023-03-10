import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ColumnMode } from '@swimlane/ngx-datatable';
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
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;
  existsError: boolean = false;
  message: string = '';
  errorList = [];
  cajetinesList: DetalleArqueo[] = [];
  totalesIncremento = {};
  columnMode = ColumnMode;

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
      this.cajetinesList = data.detalles;
      this.cajetines.next(this.cajetinesList);
      this.arqueoAtm = data;
      this.arqueoAtm.montoFinal = 0;
      this.arqueoAtm.montoArqueo = 0;
      this.arqueoAtm.montoSobrante = 0;
      this.arqueoAtm.montoFaltante = 0;
      this.arqueoAtm.esRetiroAtm = false;
      this.arqueoAtm.esIncrementoAtm = false;
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

      this.atmService.disponible(this.atmId).subscribe(data => {
        
        
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
      this.successResponse('El Registro se', 'Actualiz??')
    }, err => {
      this.btnState = false;
      this.errorResponse(undefined, false)
    });
  }

  updateValuesErrors(row: any, index) {

    row.sobrante = 0;
    row.faltante = 0;
    row.actual = 0;
    this.totalesIncremento = {};
    this.arqueoAtm.montoIncremento = 0;
    this.arqueoAtm.montoRetiro = 0;

    this.cajetinesList.forEach(d => {
      this.totalesIncremento[d.denominacion] = (this.totalesIncremento[d.denominacion] | 0) + d.incremento;
      this.arqueoAtm.montoIncremento = this.arqueoAtm.montoIncremento + (d.denominacion * d.incremento);
      this.arqueoAtm.montoRetiro = this.arqueoAtm.montoRetiro + (d.denominacion * d.retiro);
    });

    // if (row.anterior < row.dispensado + row.rechazado + row.fisico) {
    //   this.message = row.descripcion + ': Las Cantidades Dispensada+Rechazada+F??sico no pueden ser mayores al Contador Anterior';
    // } else 

    if (row.anterior == 0 && (row.fisico + row.dispensado + row.rechazado) > 0) {
      this.message = row.descripcion + ': Solo puede Registrar Incrementos';
    } else if (row.dispensado > row.anterior) {
      this.message = row.descripcion + ': La Cantidad Dispensada no puede superar al Contador Anterior';
    } else if (row.rechazado > row.anterior) {
      this.message = row.descripcion + ': La Cantidad Rechazada no puede superar al Contador Anterior';
    } else if (row.fisico > row.anterior) {
      this.message = row.descripcion + ': La Cantidad F??sica no puede superar al Contador Anterior Menos el Dispensado';
    } else if ((row.rechazado + row.fisico) == 0 && (row.retiro > row.anterior-row.dispensado)) {
      this.message = row.descripcion + ': Cantidad a Retirar no puede Superar al Contador Anterior';
    } else if ((row.rechazado + row.fisico) > 0 && (row.retiro > (row.rechazado + row.fisico))) {
      this.message = row.descripcion + ': Cantidad a Retirar no puede Superar al total de Rechazado+F??sico';
    } else if (row.fisico > row.anterior) {
      this.message = row.descripcion + ': La Cantidad F??sica no puede ser superior al Contador Anterior';
    } else {

      this.message = undefined;

      if ((row.fisico == undefined && row.rechazado == undefined) || (row.fisico == 0 && row.rechazado == 0)) {
        row.sobrante = Math.abs(((row.anterior - row.dispensado)) < 0 ? ((row.anterior - row.dispensado)) : 0);
        row.faltante = Math.abs(((row.anterior - row.dispensado)) > 0 ? ((row.anterior - row.dispensado)) : 0);
        // row.actual = row.anterior - row.dispensado + row.incremento - row.retiro; 
      } else {
        row.sobrante = Math.abs(((row.anterior - row.dispensado) - row.fisico - row.rechazado) < 0 ? (row.anterior - row.dispensado - row.fisico - row.rechazado) : 0);
        row.faltante = Math.abs(((row.anterior - row.dispensado) - row.fisico - row.rechazado) > 0 ? (row.anterior - row.dispensado - row.fisico - row.rechazado) : 0);
        // row.actual = row.fisico + row.rechazado + row.incremento - row.retiro;
      }

      row.actual = row.fisico + row.rechazado + row.incremento - row.retiro;

      if (row.sobrante > row.anterior) {
        this.message = row.descripcion + ': La Cantidad Sobrante no puede ser superior al Contador Anterior';
      } else if (row.faltante > row.anterior) {
        this.message = row.descripcion + ': La Cantidad Faltante no puede ser superior al Contador Anterior';
      }

      // Aca se recorren los cajetines
      this.atmSeleccionado.cajetines.forEach(c => {

        // Se verifica la cantidad m??xima permitida para cada uno
        if (c.id == row.cajetin && row.actual > c.cantidad) {
          this.message = row.descripcion + ': Excedi?? la Cantidad M??xima para el Cajet??n (M??x. ' + c.cantidad + ')';

        } else if (row.incremento > 0 && c.id == row.cajetin) { // Se verifica que no superen la cantidad en boveda
          if (this.totalesIncremento[row.denominacion] > c.disponible) {
            this.message = row.descripcion + ': Excedi?? la Cantidad Disponible en B??veda Para la Denominaci??n de la Moneda (Disp. ' + c.disponible + ')';
          }
        }

      })

      row.monto = row.actual * row.denominacion;
      this.arqueoAtm.montoSobrante = this.arqueoAtm.detalles.map(e => (e.denominacion * e.sobrante)).reduce((a, b) => a + b);
      this.arqueoAtm.montoFaltante = this.arqueoAtm.detalles.map(e => (e.denominacion * e.faltante)).reduce((a, b) => a + b);
      this.arqueoAtm.montoArqueo = this.arqueoAtm.detalles.map(e => (e.denominacion * (e.fisico+e.rechazado))).reduce((a, b) => a + b);
      this.arqueoAtm.montoFinal = this.arqueoAtm.detalles.map(e => (e.denominacion * e.actual)).reduce((a, b) => a + b);
    }

    // Indico el Error
    this.errorList[index] = this.message;

    // Se verifica si existe alg??n mensaje de error, si no existe se habilita el bot??n de guardar
    this.existsError = false;
    this.errorList.filter(e => { if (e != undefined) this.existsError = true; });

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
    this.arqueoAtm.tipoArqueo = this.arqueoAtm.esIncrementoAtm ? TipoArqueoConstants.INCREMENTO : (this.arqueoAtm.esRetiroAtm ? TipoArqueoConstants.RETIRO : TipoArqueoConstants.ARQUEO);
    let message = '';

    if (this.arqueoAtm.esIncrementoAtm && this.arqueoAtm.montoIncremento == 0) {
      message = 'Debe Indicar la Cantidad a Incrementar en alg??no de los Cajetines del ATM'
    } else if (this.arqueoAtm.esRetiroAtm && this.arqueoAtm.montoRetiro == 0) {
      message = 'Debe Indicar la Cantidad a Retirar en alg??no de los Cajetines del ATM'
    }


    if (message != '') {

      this.swalService.show(message, '', { showCancelButton: false }).then((resp) => {
        if (!resp.dismiss) { }
      });

    } else {

      this.swalService.show('??Desea Realizar el Arqueo del ATM?', this.atmId + ' - ' + this.atm).then((resp) => {
        if (!resp.dismiss) {
          this.arqueoAtmService.save(this.arqueoAtm).subscribe(data => {
            this.successResponse('El Arqueo', 'Realizado', false);
            return data;
          }, error => this.errorResponse(true));
        }
      });
    }






  }

}

