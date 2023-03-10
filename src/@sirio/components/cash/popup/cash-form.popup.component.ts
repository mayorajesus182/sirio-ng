
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-cash-form.popup',
  templateUrl: './cash-form.popup.component.html',
  styleUrls: ['./cash-form.popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  public valuesCono1: ConoMonetario[] = [];
  public valuesCono2: ConoMonetario[] = [];
  public moneda: Moneda = undefined;
  public operation: string;
  public preferencia = new BehaviorSubject<Preferencia>(undefined);
  // private divisor:number=1;

  public montoTotal = 0;
  public totalActual = 0;
  public totalAnterior = 0;
  public total = 0;
  private divisor: number = 1.0;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    private preferenciaService: PreferenciaService,
    dialogRef: MatDialogRef<CashFormPopupComponent>,
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

    this.cdref.detectChanges();

  }

  ngOnInit() {



    this.updateConoActual([]);
    this.updateConoAnterior([]);
    this.total = this.defaults.payload.total;

    this.moneda = this.defaults.payload.moneda;

    this.operation = this.defaults.payload.operation;

    this.preferenciaService.active().subscribe(data => {
      this.preferencia.next(data);
      this.divisor = Number.parseFloat(data.divisorConoAnterior.value);
    });

    if (this.defaults.id) {
      this.mode = 'global.edit';
    } else {
      this.defaults = {} as any;
    }

    this.cdref.detectChanges();


  }

  save() {
    this.dialogRef.close(
      {
        desgloseConoActual: this.valuesCono1,
        desgloseConoAnterior: this.valuesCono2,
        montoTotal: this.montoTotal
      });

  }
  compareValues(totalValue, totalActualValue, totalAnteriorValue) {

    return Math.abs(totalValue - (totalActualValue + (totalAnteriorValue ? totalAnteriorValue : 0))) >= 1;

  }


  close() {

    this.dialogRef.close(
      {
        desgloseConoActual: [],
        desgloseConoAnterior: [],
        montoTotal: 0
      });

  }

  updateConoActual(list: ConoMonetario[]) {
    this.totalActual = 0;
    if (list && list.length > 0) {
      this.valuesCono1 = list;
      // calculo de totales para el cono actual
      this.totalActual = list.map(e => e.cantidad * e.denominacion).reduce((a, b) => a + b);
      this.montoTotal = this.totalActual + this.totalAnterior;
      this.cdref.detectChanges();
    } else {

      // esta vacio
      this.valuesCono1 = this.valuesCono1.map(e => {
        if (e.cantidad > 0) {
          e.cantidad = 0;
        }
        return e;
      });
      this.totalActual = 0;
      this.montoTotal = 0;
      this.cdref.detectChanges();
    }

  }

  updateConoAnterior(list: ConoMonetario[]) {
    this.totalAnterior = 0;
    if (list && list.length > 0) {
      this.valuesCono2 = list;
      // calculo de totale para el cono anterior
      this.totalAnterior = list.map(e => e.cantidad * (e.denominacion / this.divisor)).reduce((a, b) => a + b);
      this.montoTotal = this.totalActual + this.totalAnterior;
      this.cdref.detectChanges();
    } else {


      this.valuesCono2 = this.valuesCono2.map(e => {
        if (e.cantidad > 0) {
          e.cantidad = 0;
        }
        return e;
      });
      this.totalAnterior - 0
      this.montoTotal = 0;
      this.cdref.detectChanges();
    }

  }

  clearAll() {
    this.updateConoActual([]);
    this.updateConoAnterior([]);
    this.cdref.detectChanges();
  }

  notValidate() {
    return this.valuesCono1.map(c => c.errors).filter(e => e != null || e != undefined).length > 0 || this.valuesCono2.map(c => c.errors).filter(e => e != null).length > 0;
  }

}
