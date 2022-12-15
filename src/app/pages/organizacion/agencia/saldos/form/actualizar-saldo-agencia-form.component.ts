import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoActualizado, SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-actualizar-saldo-agencia-form',
  templateUrl: './actualizar-saldo-agencia-form.component.html',
  styleUrls: ['./actualizar-saldo-agencia-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ActualizarSaldoAgenciaFormComponent extends FormBaseComponent implements OnInit {

  saldoActualizado: SaldoActualizado = {} as SaldoActualizado;
  public conos = new BehaviorSubject<ConoMonetario[]>([]);
  public monedas = new BehaviorSubject<Moneda[]>([]);
  public conoSave: ConoMonetario[] = [];
  preferencia: Preferencia = {} as Preferencia;
  agenciaId: string;
  agencia: string;
  saldoAnterior: number;

  constructor(
    injector: Injector,
    dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private conoMonetarioService: ConoMonetarioService,
    private preferenciaService: PreferenciaService,
    private monedaService: MonedaService,
    private saldoAgenciaService: SaldoAgenciaService,
    private cdr: ChangeDetectorRef) {
    super(undefined, injector);
  }

  ngOnInit() {

    this.agenciaId = this.route.snapshot.params['id'];

    const data = history.state.data;

    if (data) {
      this.agencia = data.nombre;
      sessionStorage.setItem('agencia_nombre', data.nombre);
    } else {
      this.agencia = sessionStorage.getItem('agencia_nombre')
    }


    // Se pregunta por la preferencia para setear la moneda del cono actual
    this.preferenciaService.get().subscribe(data => {
      this.preferencia = data;

      this.buildForm();

      this.monedaService.paraOperacionesActives().subscribe(data => {
        this.monedas.next(data);
      });

      this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByAgenciaAndMoneda(this.agenciaId, this.preferencia.monedaConoActual).subscribe(conoData => {
        this.conos.next(conoData);
      });

      this.saldoAgenciaService.getSaldoByMonedaAndAgencia(this.preferencia.monedaConoActual, this.agenciaId).subscribe(saldo => {
        this.saldoAnterior = saldo;
      });

      this.cdr.detectChanges();
    });
  }

  buildForm() {
    this.itemForm = this.fb.group({
      agencia: new FormControl(this.agenciaId),
      moneda: new FormControl(this.preferencia.monedaConoActual, Validators.required),
      monto: new FormControl(undefined, Validators.required),
    });

    this.f.moneda.valueChanges.subscribe(val => {
      this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByAgenciaAndMoneda(this.agenciaId, val).subscribe(data => {
        this.conos.next(data);
        this.cdr.detectChanges();
      });

      this.saldoAgenciaService.getSaldoByMonedaAndAgencia(val, this.agenciaId).subscribe(saldo => {
        this.saldoAnterior = saldo;
        this.cdr.detectChanges();
      });
    });

  }

  updateValues(item: ConoMonetario) {

    this.conos.subscribe(c => {
        this.f.monto.setValue(c.filter(c1 => c1.cantidad > 0).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
        this.conoSave = c.filter(c => c.cantidad > 0);
    });

}

  save() {

    if (this.itemForm.invalid)
      return;

    this.updateData(this.saldoActualizado);
    this.saldoActualizado.detalleEfectivo = this.conoSave;

    this.saldoAgenciaService.update(this.saldoActualizado).subscribe(data => {
      this.successResponse('El Saldo de la Agencia', 'Actualizado', false);
      return data;
    }, error => this.errorResponse(true));

  }

}



