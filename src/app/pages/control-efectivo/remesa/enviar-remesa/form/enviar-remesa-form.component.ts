import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { MaterialRemesa, Remesa, RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { SaldoAcopioService } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';
import { Material } from 'src/@sirio/domain/services/transporte/material.service';
import { MaterialTransporteService } from 'src/@sirio/domain/services/transporte/materiales/material-transporte.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app1-enviar-remesa-form',
    templateUrl: './enviar-remesa-form.component.html',
    styleUrls: ['./enviar-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EnviarRemesaFormComponent extends FormBaseComponent implements OnInit {

    public materialForm: FormGroup;
    private opt_swal: SweetAlertOptions;
    remesa: Remesa = {} as Remesa;
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
    public materiales = new BehaviorSubject<Material[]>([]);
    public empleados = new BehaviorSubject<EmpleadoTransporte[]>([]);
    public acopios = new BehaviorSubject<Transportista[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    materialUtilizadoList: ReplaySubject<MaterialRemesa[]> = new ReplaySubject<MaterialRemesa[]>();
    rol: Rol = {} as Rol;
    public conoSave: ConoMonetario[] = [];
    preferencia: Preferencia = {} as Preferencia;
    workflow: string = undefined;
    saldoDisponible: number = 0;
    materialRemesaList: MaterialRemesa[] = [];
    esTransportista: Boolean = false;
    public nombreReceptor = GlobalConstants.BOVEDA_PRINCIPAL_NAME;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private rolService: RolService,
        private remesaService: RemesaService,
        private saldoAcopioService: SaldoAcopioService,
        private viajeTransporteService: ViajeTransporteService,
        private materialTransporteService: MaterialTransporteService,
        private empleadoTransporteService: EmpleadoTransporteService,
        private preferenciaService: PreferenciaService,
        private transportistaService: TransportistaService,
        private monedaService: MonedaService,
        private conoMonetarioService: ConoMonetarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.isNew = true;
        this.loadingDataForm.next(true);

        this.buildForm(this.remesa);
        this.buildFormMateriales();
        this.loadingDataForm.next(false);

        this.transportistaService.allCentrosAcopio().subscribe(data => {
            this.acopios.next(data);
        });

        this.monedaService.fisicaActives().subscribe(data => {
            this.monedas.next(data);
        });

        this.rolService.getByUsuario().subscribe(rol => {
            this.esTransportista = (rol.id === GlobalConstants.TRANSPORTISTA);
        });

        this.applyFieldsDirty();
        this.cdr.detectChanges();

        this.opt_swal = {};
        this.opt_swal.input = 'text';
        this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm(remesa: Remesa) {
        this.itemForm = this.fb.group({
            cajasBolsas: new FormControl(remesa.cajasBolsas || undefined),
            transportista: new FormControl(remesa.transportista || undefined),
            receptor: new FormControl(remesa.receptor || undefined),
            moneda: new FormControl(remesa.moneda || undefined, [Validators.required]),
            viaje: new FormControl(remesa.viaje || undefined, [Validators.required]),
            plomos: new FormControl(remesa.plomos || undefined, [Validators.required]),
            montoEnviado: new FormControl(remesa.montoEnviado || undefined, [Validators.required]),
            responsables: new FormControl(remesa.responsables || undefined, [Validators.required]),
        });

        this.f.moneda.valueChanges.subscribe(value => {

            if (this.esTransportista) {

                this.conoMonetarioService.activesWithDisponibleSaldoAcopioByMoneda(value).subscribe(cono => {
                    this.conos.next(cono);
                });

                this.preferenciaService.get().subscribe(pref => {
                    this.preferencia = pref;

                    // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
                    if (this.preferencia.monedaConoActual === value) {

                        this.viajeTransporteService.allWithCosto().subscribe(vjt => {
                            this.viajes.next(vjt);
                        });

                        this.materialTransporteService.allWithCosto().subscribe(mtt => {
                            this.materiales.next(mtt);
                        });

                    } else {

                        this.viajeTransporteService.allWithCostoDivisa().subscribe(vjt => {
                            this.viajes.next(vjt);
                        });

                        this.materialTransporteService.allWithCostoDivisa().subscribe(mtt => {
                            this.materiales.next(mtt);
                        });
                    }
                });

            } else {

                this.transportistaService.activesByUbicacionAgencia().subscribe(trans => {
                    this.transportistas.next(trans);
                });

                this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByMoneda(value).subscribe(cono => {
                    this.conos.next(cono);
                });
            }
        });

        // Sólo se escoge la transportista cuando quien procesa es el centro de acopio, es decir, esto sólo pasará si la pantalla se muestra al centro de acopio
        this.f.transportista.valueChanges.subscribe(value => {

            this.empleadoTransporteService.allByTransportista(value).subscribe(emp => {
                this.empleados.next(emp);
            });

            this.loadCostosViajeTransportista();
        });

        this.f.moneda.valueChanges.subscribe(value => {
            this.loadCostosViajeTransportista();
        });
    }

    loadCostosViajeTransportista() {

        if (this.f.transportista.value != null && this.f.moneda.value != null) {
            this.preferenciaService.get().subscribe(pref => {
                this.preferencia = pref;

                // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
                if (this.preferencia.monedaConoActual === this.f.moneda.value) {

                    this.viajeTransporteService.allWithCostoByTransportista(this.f.transportista.value).subscribe(vjt => {
                        this.viajes.next(vjt);
                    });

                } else {
                    this.viajeTransporteService.allWithCostoDivisaByTransportista(this.f.transportista.value).subscribe(vjt => {
                        this.viajes.next(vjt);
                    });
                }
            });
        }
    }

    get mf() {
        return this.materialForm ? this.materialForm.controls : {};
    }

    buildFormMateriales() {
        this.materialForm = this.fb.group({
            material: new FormControl(undefined, [Validators.required]),
            cantidad: new FormControl(undefined, [Validators.required]),
        });
    }

    addMaterial() {
        if (this.materialForm.invalid)
            return;

        let materialRemesa = {} as MaterialRemesa;
        this.updateDataFromValues(materialRemesa, this.materialForm.value);
        this.materialRemesaList.push(materialRemesa);
        this.materialUtilizadoList.next(this.materialRemesaList.slice());
        this.mf.material.setValue(undefined);
        this.mf.cantidad.setValue(undefined);
        this.cdr.detectChanges();
    }

    deleteMaterial(row) {
        this.materialRemesaList.forEach((e, index) => {
            if (e.material === row.material) {
                this.materialRemesaList.splice(index, 1);
                this.materialUtilizadoList.next(this.materialRemesaList.slice());
            }
            this.cdr.detectChanges();
        });
    }

    obtenerSaldo() {

        this.saldoDisponible = 0;
        this.f.montoEnviado.setValue(undefined);

        this.saldoAcopioService.getSaldoByMoneda(this.remesa.moneda).subscribe(data => {
            this.saldoDisponible = data;
            this.cdr.detectChanges();
        });
    }

    updateValuesErrors(item: ConoMonetario) {

        this.f.montoEnviado.setValue(0.0);

        this.conos.subscribe(c => {
            this.f.montoEnviado.setValue(c.filter(c1 => c1.cantidad != undefined).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
            this.conoSave = c.filter(c => c.cantidad > 0);
            this.cdr.detectChanges();
        });

        if (item && item.cantidad > item.disponible) {
            this.itemForm.controls['montoEnviado'].setErrors({
                cantidad: true
            });
            this.f.montoEnviado.setValue(0.0);
            this.cdr.detectChanges();
        }
    }

    preConfirmFunt(obs: string) {

        if (!obs || obs.trim().length == 0) {
            swal.showValidationMessage(
                'La observación es requerida!'
            );
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.remesa);

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        this.remesa.materiales = this.materialRemesaList;
        this.remesa.detalleEfectivo = this.conoSave;

        console.log('this.remesa     ', this.remesa);


        this.remesaService.send(this.remesa).subscribe(data => {
            this.itemForm.reset({});
            this.successResponse('La Remesa fue', 'Procesada', false);
            return data;
        }, error => this.errorResponse(true));

    }
}

