import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { SolicitudRemesa, SolicitudRemesaService } from 'src/@sirio/domain/services/control-efectivo/solicitud-remesa.service';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import * as moment from 'moment';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';

@Component({
    selector: 'app-solicitud-remesa-form',
    templateUrl: './solicitud-remesa-form.component.html',
    styleUrls: ['./solicitud-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitudRemesaFormComponent extends FormBaseComponent implements OnInit {

    preferencia: Preferencia = {} as Preferencia;
    solicitudRemesa: SolicitudRemesa = {} as SolicitudRemesa;
    public detalles = new BehaviorSubject<CupoAgencia[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
    cupo: number = 0;
    todayValue: moment.Moment;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private solicitudRemesaService: SolicitudRemesaService,
        private transportistaService: TransportistaService,
        private calendarioService: CalendarioService,
        private cupoAgenciaService: CupoAgenciaService,
        private monedaService: MonedaService,
        private viajeTransporteService: ViajeTransporteService,
        private preferenciaService: PreferenciaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    // TODO: AGREGAR ETIQUETAS FALTANTES, ANALIZAR LOS ROLES DE LOS USUARIOS PARA LA PANTALLA
    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = true;
        this.loadingDataForm.next(true);

        this.buildForm(this.solicitudRemesa);
        this.loadingDataForm.next(false);

        this.transportistaService.allCentrosAcopio().subscribe(data => {
            this.transportistas.next(data);
            this.cdr.detectChanges();
        });

        this.preferenciaService.get().subscribe(data => {
            this.preferencia = data;
        });

    }

    buildForm(solicitudRemesa: SolicitudRemesa) {
        this.itemForm = this.fb.group({
            receptor: new FormControl(solicitudRemesa.receptor || undefined, [Validators.required]),
            moneda: new FormControl(solicitudRemesa.moneda || undefined, [Validators.required]),
            viaje: new FormControl(solicitudRemesa.moneda || undefined, [Validators.required]),
            montoSolicitado: new FormControl(solicitudRemesa.montoSolicitado || undefined, [Validators.required]),
        });

        this.f.receptor.valueChanges.subscribe(value => {
            this.monedaService.forRemesasAll().subscribe(data => {
                this.monedas.next(data);
                this.cdr.detectChanges();
            });

            console.log(this.f.receptor.value);
            
        });

        this.f.moneda.valueChanges.subscribe(value => {
            this.cupoAgenciaService.getCupoByMoneda(value).subscribe(data => {
                this.cupo = data;
                this.cdr.detectChanges();
            });

            this.f.viaje.setValue(undefined);

            if (this.preferencia.monedaConoActual === this.f.moneda.value) {

                this.viajeTransporteService.allWithCostoByTransportista(this.f.receptor.value).subscribe(data => {
                    this.viajes.next(data);
                    this.cdr.detectChanges();
                });

            } else {

                this.viajeTransporteService.allWithCostoDivisaByTransportista(this.f.receptor.value).subscribe(data => {
                    this.viajes.next(data);
                    this.cdr.detectChanges();
                });
            }

        });


    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.solicitudRemesa);

        this.swalService.show('¿Desea Enviar la Solicitud?', '').then((resp) => {
            if (!resp.dismiss) {
                this.saveOrUpdate(this.solicitudRemesaService, this.solicitudRemesa, 'La Solicitud de Remesas', this.isNew);
            }
        });
    }

}

