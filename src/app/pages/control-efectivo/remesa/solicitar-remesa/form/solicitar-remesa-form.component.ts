import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { Remesa, RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-solicitar-remesa-form',
    templateUrl: './solicitar-remesa-form.component.html',
    styleUrls: ['./solicitar-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitarRemesaFormComponent extends FormBaseComponent implements OnInit {

    preferencia: Preferencia = {} as Preferencia;
    remesa: Remesa = {} as Remesa;
    public detalles = new BehaviorSubject<CupoAgencia[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
    cupo: number = 0;
    todayValue: moment.Moment;
    esTransportista: Boolean = false;
    public bovedaPrincipal = GlobalConstants.BOVEDA_PRINCIPAL;
    public nombreReceptor = GlobalConstants.BOVEDA_PRINCIPAL_NAME;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private remesaService: RemesaService,
        private transportistaService: TransportistaService,
        private cupoAgenciaService: CupoAgenciaService,
        private monedaService: MonedaService,
        private viajeTransporteService: ViajeTransporteService,
        private preferenciaService: PreferenciaService,
        private rolService: RolService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    // TODO: AGREGAR ETIQUETAS FALTANTES, ANALIZAR LOS ROLES DE LOS USUARIOS PARA LA PANTALLA
    ngOnInit() {

       // let id = this.route.snapshot.params['id'];
        this.isNew = true;
        this.loadingDataForm.next(true);

        this.rolService.getByUsuario().subscribe(rol => {
            this.esTransportista = (rol.id === GlobalConstants.TRANSPORTISTA);

            // Si quien solicita es de rol transportista, siempre irá contra la boveda principal
            if (this.esTransportista) {

                this.monedaService.actives().subscribe(data => {
                    this.monedas.next(data);
                    this.cdr.detectChanges();
                });
            } else {

                this.transportistaService.allCentrosAcopio().subscribe(data => {
                    this.transportistas.next(data);
                });
        
                this.preferenciaService.get().subscribe(data => {
                    this.preferencia = data;
                });
            }


            this.buildForm(this.remesa);
            this.loadingDataForm.next(false);
            this.applyFieldsDirty();
            this.cdr.markForCheck();

        });

        this.cdr.detectChanges();
    }

    buildForm(remesa: Remesa) {
        this.itemForm = this.fb.group({
            receptor: new FormControl(remesa.receptor || undefined),
            moneda: new FormControl(remesa.moneda || undefined, [Validators.required]),
            viaje: new FormControl(remesa.moneda || undefined),
            montoSolicitado: new FormControl(remesa.montoSolicitado || undefined, [Validators.required]),
        });


        this.f.receptor.valueChanges.subscribe(value => {
            this.monedaService.forRemesasAll().subscribe(data => {
                this.monedas.next(data);
                this.cdr.detectChanges();
            });
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

        this.updateData(this.remesa);

        this.swalService.show('¿Desea Enviar la Solicitud?', '').then((resp) => {
            if (!resp.dismiss) {
                this.saveOrUpdate(this.remesaService, this.remesa, 'La Solicitud de Remesas', this.isNew);
            }
        });
    }

}

