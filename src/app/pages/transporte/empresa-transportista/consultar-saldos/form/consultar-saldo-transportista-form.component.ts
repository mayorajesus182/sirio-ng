import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAcopioService, SaldoActualizadoAcopio } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-consultar-saldo-transportista-form',
  templateUrl: './consultar-saldo-transportista-form.component.html',
  styleUrls: ['./consultar-saldo-transportista-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ConsultarSaldoTransportistaFormComponent extends FormBaseComponent implements OnInit {

  saldoActualizado: SaldoActualizadoAcopio = {} as SaldoActualizadoAcopio;
  public conos = new BehaviorSubject<ConoMonetario[]>([]);
  public monedas = new BehaviorSubject<Moneda[]>([]);
  public conoSave: ConoMonetario[] = [];
  preferencia: Preferencia = {} as Preferencia;
  transportistaId: string;
  transportista: string;
  saldoAnterior: number;
  faltaDesglose: boolean = false;

  constructor(
    injector: Injector,
    dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private conoMonetarioService: ConoMonetarioService,
    private preferenciaService: PreferenciaService,
    private monedaService: MonedaService,
    private saldoAcopioService: SaldoAcopioService,
    private cdr: ChangeDetectorRef) {
    super(undefined, injector);
  }

  ngOnInit() {

    this.transportistaId = this.route.snapshot.params['id'];

    const data = history.state.data;

    if (data) {
      this.transportista = data.nombre;
      sessionStorage.setItem('transportista_nombre', data.nombre);
    } else {
      this.transportista = sessionStorage.getItem('transportista_nombre')
    }


    // Se pregunta por la preferencia para setear la moneda del cono actual
    this.preferenciaService.get().subscribe(data => {
      this.preferencia = data;

      this.buildForm();

      this.monedaService.paraOperacionesActives().subscribe(data => {
        this.monedas.next(data);
      });

      this.conoMonetarioService.activesLastDisponibleSaldoAcopioByTransportistaAndMoneda(this.transportistaId, this.preferencia.monedaConoActual).subscribe(conoData => {
        this.conos.next(conoData);
      });

      this.saldoAcopioService.getLastSaldoByTransportistaAndMoneda(this.transportistaId, this.preferencia.monedaConoActual).subscribe(saldo => {
        this.saldoAnterior = saldo;
      });

      this.cdr.detectChanges();
    });
  }

  buildForm() {
    this.itemForm = this.fb.group({
      moneda: new FormControl(this.preferencia.monedaConoActual, Validators.required),
    });

    this.f.moneda.valueChanges.subscribe(val => {
      this.conoMonetarioService.activesLastDisponibleSaldoAcopioByTransportistaAndMoneda(this.transportistaId, val).subscribe(data => {
        this.conos.next(data);
        this.cdr.detectChanges();
      });

      this.saldoAcopioService.getLastSaldoByTransportistaAndMoneda(this.transportistaId, val).subscribe(saldo => {
        this.saldoAnterior = saldo;
        this.cdr.detectChanges();
      });
    });

  }

}



