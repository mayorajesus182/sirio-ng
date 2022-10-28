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
  arqueoAtm: ArqueoAtm = {} as ArqueoAtm;
  moneda: Moneda = {} as Moneda;
  atmId: string;
  atm: string;
  montoRow: number = 0;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;


  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private cajetinService: CajetinService,
    private arqueoAtmService: ArqueoAtmService,
    private monedaService: MonedaService,
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
      this.atm = data.codigo;
      sessionStorage.setItem('trans_nombre', data.codigo);
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


  updateValuesErrors(row: any) {

    if (row.anterior < row.dispensado + row.rechazado) {
      console.log('La cantidad Dispensada más la Rechazada no debe ser mayor al Contador Anterior');
    } else if (row.anterior == 0 && row.fisico > 0) {
      console.log('Sin Contador Anterior no puede existir un Físico');
    } else if (row.fisico > 0 && row.retiro > row.fisico) {
      console.log('El monto a Retirar supera el disponible en el ATM');
    } else if ((row.fisico == 0 || !row.fisico ) && row.retiro > row.anterior - row.dispensado + row.rechazado) {
      console.log('El monto a Retirar supera el disponible en el ATM');
    } else {

      console.log('fisico ', row.fisico );
      
      row.sobrante = row.fisico > (row.anterior - row.dispensado) ? (row.fisico - row.anterior - row.dispensado) : 0;
      row.faltante = (row.fisico > 0 && row.fisico < (row.anterior - row.dispensado)) ? row.anterior - row.dispensado - row.fisico : 0;
      row.actual = row.fisico > 0 ? row.fisico + row.incremento - row.retiro : row.anterior - row.dispensado + row.rechazado + row.incremento - row.retiro;
      row.monto = row.actual * row.denominacion;
      this.arqueoAtm.monto = this.arqueoAtm.detalles.map(e => (e.denominacion * e.actual)).reduce((a, b) => a + b);
    }
  }

  save() {
    this.arqueoAtm.atm = this.atmId;  
    this.arqueoAtm.tipoArqueo = TipoArqueoConstants.CHEQUEO;
    this.saveOrUpdate(this.arqueoAtmService, this.arqueoAtm, 'El Arqueo', this.isNew);
    this.back();
  }

}

