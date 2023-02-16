import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RolConstants } from 'src/@sirio/constants';
import { MaterialRemesa, Remesa, RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app1-despachar-remesa-form',
    templateUrl: './despachar-remesa-form.component.html',
    styleUrls: ['./despachar-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DespacharRemesaFormComponent extends FormBaseComponent implements OnInit {

    remesa: Remesa = {} as Remesa;
    public viajes = new BehaviorSubject<Viaje[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    public empleados = new BehaviorSubject<EmpleadoTransporte[]>([]);
    rol: Rol = {} as Rol;
    preferencia: Preferencia;
    workflow: string = undefined;
    saldoDisponible: number = 0;
    materialRemesaList: MaterialRemesa[] = [];
    esTransportista: Boolean = false;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private rolService: RolService,
        private remesaService: RemesaService,
        private viajeTransporteService: ViajeTransporteService,
        private preferenciaService: PreferenciaService,
        private empleadoTransporteService: EmpleadoTransporteService,
        private transportistaService: TransportistaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.loadingDataForm.next(true);

        this.remesaService.get(id).subscribe(data => {
            this.remesa = data;

            this.isNew = data.montoEnviado == 0;

            this.rolService.getByUsuario().subscribe(rol => {

                this.esTransportista = (rol.id === RolConstants.TRANSPORTISTA);
                this.buildForm();
                this.loadingDataForm.next(false);

                // Si quien va a procesar la solicitud es transportista (Centro de Acopio), se buscan los viajes según la moneda 
                if (this.esTransportista) {

                    this.preferenciaService.active().subscribe(pref => {
                        this.preferencia = pref;

                        // Si es moneda local se bucan los viajes bolivares mayores a cero, de otro modo se buscan viajes con divisas meyores a cero
                        if (this.preferencia.monedaConoActual.value === this.remesa.moneda) {

                            this.viajeTransporteService.allWithCostoByTransportista(this.remesa.receptor).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });

                        } else {

                            this.viajeTransporteService.allWithCostoDivisaByTransportista(this.remesa.receptor).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });
                        }
                    });

                    this.empleadoTransporteService.allEmpleados().subscribe(emp => {
                        this.empleados.next(emp);
                    });

                } else {

                    this.empleadoTransporteService.allByTransportista(this.remesa.transportista).subscribe(emp => {
                        this.empleados.next(emp);
                    });

                    this.transportistaService.actives().subscribe(trans => {
                        this.transportistas.next(trans);
                    });

                    this.preferenciaService.active().subscribe(pref => {
                        this.preferencia = pref;

                        if (this.preferencia.monedaConoActual.value === this.remesa.moneda) {

                            this.viajeTransporteService.allWithCostoByTransportista(this.remesa.transportista).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });

                        } else {

                            this.viajeTransporteService.allWithCostoDivisaByTransportista(this.remesa.transportista).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });
                        }
                    });

                }
            });

            this.cdr.detectChanges();
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            transportista: new FormControl(this.remesa.transportista || undefined),
            viaje: new FormControl(this.remesa.viaje || undefined, [Validators.required]),
            responsables: new FormControl(this.remesa.responsables || undefined, [Validators.required]),
        });

        // Sólo se escoge la transportista cuando quien procesa es el centro de acopio, es decir, esto sólo pasará si la pantalla se muestra al centro de acopio
        this.f.transportista.valueChanges.subscribe(value => {


            this.empleadoTransporteService.allByTransportista(value).subscribe(emp => {
                this.empleados.next(emp);
            });

            // Si es moneda local se bucan los viajes con bolivares mayores a cero, de otro modo se buscan viajes con divisas meyores a cero
            if (this.preferencia.monedaConoActual.value === this.remesa.moneda) {

                this.viajeTransporteService.allWithCostoByTransportista(value).subscribe(vjt => {
                    this.viajes.next(vjt);
                });

            } else {

                this.viajeTransporteService.allWithCostoDivisaByTransportista(value).subscribe(vjt => {
                    this.viajes.next(vjt);
                });
            }
        });

        this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.remesa);
        this.remesa.detalleEfectivo = [];

        this.swalService.show('¿Desea Despachar la Solicitud?', this.remesa.id).then((resp) => {
            if (!resp.dismiss) {
                this.remesaService.dispatch(this.remesa).subscribe(data => {
                    this.successResponse('La Remesa', 'Despachada', false);
                    return data;
                }, error => this.errorResponse(true));
            }
        });
    }
}

