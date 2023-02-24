import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { DestinoCuenta, DestinoCuentaService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/destino-cuenta.service';
import { MotivoSolicitud, MotivoSolicitudService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/motivo-solicitud.service';
import { OrigenFondo, OrigenFondoService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/origen-fondo.service';
import { PromedioMonto, PromedioMontoService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/promedio-monto.service';
import { PromedioTransaccion, PromedioTransaccionService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/promedio-transaccion.service';
import { TipoFirma, TipoFirmaService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/tipo-firma.service';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/tipo-firmante.service';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/tipo-participacion.service';
import { CuentaBanco } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-producto-cuenta-registro-form.popup',
  templateUrl: './producto-cuenta-registro-form.popup.component.html',
  styleUrls: ['./producto-cuenta-registro-form.popup.component.scss']
})
export class ProductoCuentaRegistroFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  dataProducto: any = {};
  cuentaBanco: CuentaBanco = {} as CuentaBanco;
  public promedioTransacciones = new BehaviorSubject<PromedioTransaccion[]>([]);
  public promedioMontos = new BehaviorSubject<PromedioMonto[]>([]);
  public paises = new BehaviorSubject<Pais[]>([]);
  public origenes = new BehaviorSubject<OrigenFondo[]>([]);
  public destinos = new BehaviorSubject<DestinoCuenta[]>([]);
  public motivos = new BehaviorSubject<MotivoSolicitud[]>([]);
  public tipoParticipaciones = new BehaviorSubject<TipoParticipacion[]>([]);
  public tipoFirmas = new BehaviorSubject<TipoFirma[]>([]);
  public tipoFirmantes = new BehaviorSubject<TipoFirmante[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ProductoCuentaRegistroFormPopupComponent>,
    private origenFondoService: OrigenFondoService,
    private destinoCuentaService: DestinoCuentaService,
    private motivoSolicitudService: MotivoSolicitudService,
    private promedioTransaccionService: PromedioTransaccionService,
    private promedioMontoService: PromedioMontoService,
    private tipoParticipacionService: TipoParticipacionService,
    private tipoFirmaService: TipoFirmaService,
    private tipoFirmanteService: TipoFirmanteService,
    private paisService: PaisService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.loadingDataForm.next(true);
    if (this.defaults.payload) {
      this.dataProducto = this.defaults.payload;
      this.mode = 'global.edit';
      this.buildForm();
    }

    this.promedioTransaccionService.actives().subscribe(data => {
      this.promedioTransacciones.next(data);
    });

    this.promedioMontoService.actives().subscribe(data => {
      this.promedioMontos.next(data);
    });

    this.paisService.actives().subscribe(data => {
      this.paises.next(data);
    });

    this.origenFondoService.actives().subscribe(data => {
      this.origenes.next(data);
    });

    this.destinoCuentaService.actives().subscribe(data => {
      this.destinos.next(data);
    });

    this.motivoSolicitudService.actives().subscribe(data => {
      this.motivos.next(data);
    });

    this.tipoParticipacionService.actives().subscribe(data => {
      this.tipoParticipaciones.next(data);
    })

    this.tipoFirmaService.actives().subscribe(data => {
      this.tipoFirmas.next(data);
    });

    this.tipoFirmanteService.actives().subscribe(data => {
      this.tipoFirmantes.next(data);
    });

    this.cdr.detectChanges();

  }

  buildForm() {

    this.itemForm = this.fb.group({
      origenFondo: new FormControl(this.cuentaBanco.origenFondo || undefined, [Validators.required]),
      destinoCuenta: new FormControl(this.cuentaBanco.destinoCuenta || undefined, [Validators.required]),
      motivoSolicitud: new FormControl(this.cuentaBanco.motivoSolicitud || undefined, [Validators.required]),
      transaccionesCredito: new FormControl(this.cuentaBanco.transaccionesCredito || undefined, [Validators.required]),
      montoCredito: new FormControl(this.cuentaBanco.montoCredito || undefined, [Validators.required]),
      transaccionesDebito: new FormControl(this.cuentaBanco.transaccionesDebito || undefined, [Validators.required]),
      montoDebito: new FormControl(this.cuentaBanco.montoDebito || undefined, [Validators.required]),
      transaccionesElectronico: new FormControl(this.cuentaBanco.transaccionesElectronico || undefined, [Validators.required]),
      montoElectronico: new FormControl(this.cuentaBanco.montoElectronico || undefined, [Validators.required]),
      fondoExterior: new FormControl(this.cuentaBanco.fondoExterior || false),
      paisOrigen: new FormControl(this.cuentaBanco.paisOrigen || undefined),
      paisDestino: new FormControl(this.cuentaBanco.paisDestino || undefined),
      tipoParticipacion: new FormControl(this.cuentaBanco.tipoParticipacion || undefined, [Validators.required]),
      tipoFirma: new FormControl(this.cuentaBanco.tipoFirma || undefined, [Validators.required]),
      tipoFirmante: new FormControl(this.cuentaBanco.tipoFirmante || undefined, [Validators.required]),
    });

    this.cdr.detectChanges();
  }

  save() {

    // console.log('mode ', this.mode);
    // this.updateData(this.direccion);// aca actualizamos la direccion

    // this.saveOrUpdate(this.direccionService, this.direccion, 'La Dirección', this.direccion.id == undefined);

  }


}