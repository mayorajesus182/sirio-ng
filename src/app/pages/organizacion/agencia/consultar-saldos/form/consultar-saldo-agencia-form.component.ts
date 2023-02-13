import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoActualizadoAgencia, SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-consultar-saldo-agencia-form',
  templateUrl: './consultar-saldo-agencia-form.component.html',
  styleUrls: ['./consultar-saldo-agencia-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ConsultarSaldoAgenciaFormComponent extends FormBaseComponent implements OnInit {

  saldoActualizado: SaldoActualizadoAgencia = {} as SaldoActualizadoAgencia;
  public conos = new BehaviorSubject<ConoMonetario[]>([]);
  public monedas = new BehaviorSubject<Moneda[]>([]);
  public conoSave: ConoMonetario[] = [];
  preferencia: any;
  agenciaId: string;
  agencia: string;
  saldoAnterior: number;
  faltaDesglose: boolean = false;

  constructor(
    injector: Injector,
    dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
    this.preferenciaService.parametros().subscribe(data => {
      this.preferencia = data;

      this.buildForm();

      this.monedaService.paraOperacionesActives().subscribe(data => {
        this.monedas.next(data);
      });

      this.saldoAgenciaService.activesLastDisponibleSaldoAgenciaByAgenciaAndMoneda(this.agenciaId, this.preferencia.monedaConoActual.value).subscribe(conoData => {
        this.conos.next(conoData);
      });

      this.saldoAgenciaService.getLastSaldoByAgenciaAndMoneda(this.agenciaId, this.preferencia.monedaConoActual.value).subscribe(saldo => {
        this.saldoAnterior = saldo;
      });

      this.cdr.detectChanges();
    });
  }

  buildForm() {
    this.itemForm = this.fb.group({
      moneda: new FormControl(this.preferencia.monedaConoActual.value, Validators.required),
    });

    this.f.moneda.valueChanges.subscribe(val => {
      this.saldoAgenciaService.activesLastDisponibleSaldoAgenciaByAgenciaAndMoneda(this.agenciaId, val).subscribe(data => {
        this.conos.next(data);
        this.cdr.detectChanges();
      });

      this.saldoAgenciaService.getLastSaldoByAgenciaAndMoneda(this.agenciaId, val).subscribe(saldo => {
        this.saldoAnterior = saldo;
        this.cdr.detectChanges();
      });
    });

  }

}



