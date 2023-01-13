import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RolConstants } from 'src/@sirio/constants';
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
    plomoList = [];
    materialList: Material[] = [];
    plomoCtrl = new FormControl([], [Validators.required]);
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
    monedaDeRemesa: Moneda[] = [];
    esTransportista: Boolean = false;
    public nombreReceptor = GlobalConstants.BOVEDA_PRINCIPAL_NAME;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
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

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        // Se pregunta por la moneda actual para colocarla cuando sea nuevo
        this.preferenciaService.get().subscribe(data => {
            this.preferencia = data;

            this.rolService.getByUsuario().subscribe(rol => {
                this.esTransportista = (rol.id === RolConstants.TRANSPORTISTA);

                this.whenChangeMoneda(this.preferencia.monedaConoActual);

                if (this.esTransportista) {
                    this.empleadoTransporteService.allEmpleados().subscribe(emp => {
                        this.empleados.next(emp);
                    });
                }

                this.buildFormMateriales();
                this.loadingDataForm.next(false);
                // this.applyFieldsDirty();
                // this.cdr.markForCheck();

                if (id) {
                    this.remesaService.get(id).subscribe((rem: Remesa) => {
                        this.remesa = rem;
                        this.buildForm();

                        if (this.remesa.esAgencia == 1) {
                            
                            this.transportistaService.activesByUbicacionAgencia().subscribe(trans => {
                                this.transportistas.next(trans);
                            });

                            this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByMoneda(this.remesa.moneda).subscribe(conoData => {

                                conoData = conoData.map(c => {
                                    let val = rem.detalleEfectivo.filter(c1 => c1.id.cono == c.id)[0];
                                    c.cantidad = val ? val.cantidad : 0;
                                    c.disponible = val ? c.disponible + val.cantidad : c.disponible;
                                    return c;
                                })

                                this.conos.next(conoData);
                                this.updateValuesErrors(this.conos[0]);
                                this.cdr.detectChanges();
                            });

                            this.empleadoTransporteService.allByTransportista(this.remesa.transportista).subscribe(emp => {
                                this.empleados.next(emp);
                            });

                            this.loadCostosViajeTransportista(this.remesa.moneda, this.remesa.transportista);

                        } else {

                            this.conoMonetarioService.activesWithDisponibleSaldoAcopioByMoneda(this.remesa.moneda).subscribe(conoData => {

                                conoData = conoData.map(c => {
                                    let val = rem.detalleEfectivo.filter(c1 => c1.id.cono == c.id)[0];
                                    c.cantidad = val ? val.cantidad : 0;
                                    c.disponible = val ? c.disponible + val.cantidad : c.disponible;
                                    return c;
                                })

                                this.conos.next(conoData);
                                this.updateValuesErrors(this.conos[0]);
                                this.cdr.detectChanges();
                            });

                            this.remesa.materiales.forEach(mr => {
                                let materialRemesa = {} as MaterialRemesa;
                                this.updateDataFromValues(materialRemesa, mr);
                                this.materialRemesaList.push(materialRemesa);
                                this.materialUtilizadoList.next(this.materialRemesaList.slice());
                                this.cdr.detectChanges();
                            });

                            this.loadCostosViajeTransportista(this.remesa.moneda, this.remesa.emisor);
                            this.loadCostosMaterialTransportista(this.remesa.moneda, this.remesa.emisor);
                        }

                        this.monedaService.get(this.remesa.moneda).subscribe(mon => {
                            this.monedaDeRemesa.push(mon);     
                            this.monedas.next(this.monedaDeRemesa.slice()); 
                        });

                    });

                } else {

                    this.buildForm();
                }

            });

        });

        this.transportistaService.allCentrosAcopio().subscribe(data => {
            this.acopios.next(data);
        });

        this.monedaService.forEnvioRemesasAll().subscribe(data => {
            this.monedas.next(data);
        });

        this.opt_swal = {};
        this.opt_swal.input = 'text';
        this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;


    }

    buildForm() {
        // console.log('remesa ', this.remesa);

        this.itemForm = this.fb.group({
            cajasBolsas: new FormControl(this.remesa.cajasBolsas || undefined),
            transportista: new FormControl(this.remesa.transportista || undefined),
            receptor: new FormControl(this.remesa.receptor || undefined),
            moneda: new FormControl(this.remesa.moneda || (this.esTransportista ? this.preferencia.monedaConoActual : undefined), [Validators.required]),
            viaje: new FormControl(this.remesa.viaje || undefined, [Validators.required]),
            montoEnviado: new FormControl(this.remesa.montoEnviado || undefined, [Validators.required]),
            responsables: new FormControl(this.remesa.responsables || undefined, [Validators.required]),
        });

        this.f.moneda.valueChanges.subscribe(value => {
            this.whenChangeMoneda(value);
        });

        this.f.receptor.valueChanges.subscribe(value => {
            let monedaLocal = this.monedas.value.filter(e => e.id == this.preferencia.monedaConoActual)[0];
            this.f.moneda.setValue(monedaLocal?.id);
        });

        // Sólo se escoge la transportista cuando quien procesa es el centro de acopio, es decir, esto sólo pasará si la pantalla se muestra al centro de acopio
        this.f.transportista.valueChanges.subscribe(value => {

            this.empleadoTransporteService.allByTransportista(value).subscribe(emp => {
                this.empleados.next(emp);
            });

            if (this.f.moneda.value != null) {
                this.loadCostosViajeTransportista(this.f.moneda.value, value);
            }

        });

        this.f.moneda.valueChanges.subscribe(value => {
            if (this.f.transportista.value != null) {
                this.loadCostosViajeTransportista(value, this.f.transportista.value);
            }
        });

        this.f.cajasBolsas.valueChanges.subscribe(value => {
            this.comparePlomos();
        });

        this.plomoCtrl.setValue(this.remesa.plomos ? this.remesa.plomos.split(',') : []);
        this.plomoList = this.remesa.plomos ? this.remesa.plomos.split(',') : [];

        this.onLoadMaterialesUtilizados();

        // this.materiales.subscribe(()=>this.onLoadMaterialesUtilizados());

        this.cdr.detectChanges();
    }

    whenChangeMoneda(moneda) {
        if (this.esTransportista) {

            this.conoMonetarioService.activesWithDisponibleSaldoAcopioByMoneda(moneda).subscribe(cono => {
                this.conos.next(cono);
            });

            // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
            if (this.preferencia.monedaConoActual === moneda) {

                this.viajeTransporteService.allWithCosto().subscribe(vjt => {
                    this.viajes.next(vjt);
                });

                this.materialTransporteService.allWithCosto().subscribe(mtt => {
                    this.materialList = mtt;
                    this.materiales.next(mtt);
                });

            } else {

                this.viajeTransporteService.allWithCostoDivisa().subscribe(vjt => {
                    this.viajes.next(vjt);
                });

                this.materialTransporteService.allWithCostoDivisa().subscribe(mtt => {
                    this.materialList = mtt;
                    this.materiales.next(mtt);
                });
            }


        } else {

            this.transportistaService.activesByUbicacionAgencia().subscribe(trans => {
                this.transportistas.next(trans);
            });

            this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByMoneda(moneda).subscribe(cono => {
                this.conos.next(cono);
            });
        }
    }

    onLoadMaterialesUtilizados() {
        this.materialUtilizadoList.subscribe(list => {

            if (!list || list.length == 0) {
                this.materiales.next(this.materialList);
            } else {
                // console.log(list.map(mu => mu.material));

                this.materiales.next(
                    this.materialList.filter(m => !list.map(mu => mu.material).includes(m.id))
                );
            }
        })
    }

    loadCostosViajeTransportista(moneda, transportista) {

        // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
        if (this.preferencia.monedaConoActual === moneda) {

            this.viajeTransporteService.allWithCostoByTransportista(transportista).subscribe(vjt => {
                this.viajes.next(vjt);
            });

        } else {
            this.viajeTransporteService.allWithCostoDivisaByTransportista(transportista).subscribe(vjt => {
                this.viajes.next(vjt);
            });
        }
    }

    loadCostosMaterialTransportista(moneda, transportista) {

        // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
        if (this.preferencia.monedaConoActual === moneda) {

            this.materialTransporteService.allWithCostoByTransportista(transportista).subscribe(mat => {
                this.materialList = mat;
                this.materiales.next(mat);
            });

        } else {
            this.materialTransporteService.allWithCostoDivisaByTransportista(transportista).subscribe(mat => {
                this.materialList = mat;
                this.materiales.next(mat);
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

        const ix = this.materialRemesaList.findIndex(m => m.material == materialRemesa.material);
        if (ix >= 0) {
            // si ya existe lo actualizo
            this.materialRemesaList.splice(ix, 1);
        }

        this.materialRemesaList.push(materialRemesa);
        this.materialUtilizadoList.next(this.materialRemesaList.slice());
        this.mf.material.setValue(undefined);
        this.mf.cantidad.setValue(undefined);

        this.comparePlomos();
        this.cdr.detectChanges();
    }

    deleteMaterial(row) {
        this.materialRemesaList.forEach((e, index) => {
            if (e.material === row.material) {
                this.materialRemesaList.splice(index, 1);
                this.materialUtilizadoList.next(this.materialRemesaList.slice());
            }
            this.comparePlomos();
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

    getNombreMaterial(id: string) {
        if (!this.materialList || this.materialList.length == 0) {
            return '';
        }
        return this.materialList.filter(m => m.id == id).map(m => m.id + " - " + m.nombre);
    }

    removePlomo(plomo: string) {
        const index = this.plomoList.indexOf(plomo);
        if (index >= 0) {
            this.plomoList.splice(index, 1);
        }
        this.comparePlomos();
    }

    addPlomo(event: MatChipInputEvent) {

        const value = (event.value || '').trim();
        if (value === '') {
            return;
        }
        // console.log(event);

        if (!value.match(/^[0-9]*$/)) {
            // console.log('match reg ex ', value);
            this.plomoCtrl.setErrors({ pattern: true });
            // this.plomoCtrl.markAsDirty();
            // this.cdr.detectChanges();
            return;
        }

        if (value.length != this.preferencia.digitosPlomo) {
            this.plomoCtrl.setErrors({ length: `El plomo debe tener ${this.preferencia.digitosPlomo} dígitos` });
            return;
        }

        if (this.plomoList.includes(value)) {
            this.plomoCtrl.setErrors({ exists: true });
            return;
        }

        // Add plomo
        if (value) {
            this.plomoList.push(value);
            this.plomoCtrl.setValue(this.plomoList);
        }

        this.plomoCtrl.setErrors(null);
        this.plomoCtrl.updateValueAndValidity();
        // Clear the input value
        event.chipInput!.clear();
        this.comparePlomos();
        this.cdr.detectChanges();

    }


    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.plomoList, event.previousIndex, event.currentIndex);
    }


    comparePlomos() {
        this.plomoCtrl.setErrors({ difference: false });

        if (!this.esTransportista && this.plomoList.length != this.f.cajasBolsas.value) {
            this.plomoCtrl.setErrors({ difference: true });
        }

        if (this.esTransportista) {
            let total = 0;
            this.materialUtilizadoList.subscribe(materialesSeleccionados => {
                total = 0;
                for (let i = 0; i < materialesSeleccionados.length; i++) {
                    for (let j = 0; j < this.materialList.length; j++) {
                        if (materialesSeleccionados[i].material == this.materialList[j].id) {
                            total += materialesSeleccionados[i].cantidad * this.materialList[j].plomo;
                        }
                    }
                }
            });

            if (this.plomoList.length != total) {
                this.plomoCtrl.setErrors({ difference: true });
            }
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
        this.remesa.plomos = this.plomoList.join(',');

        if (this.isNew) {
            this.remesaService.sendCreate(this.remesa).subscribe(data => {
                this.itemForm.reset({});
                this.successResponse('La Remesa', 'Procesada', false);
                return data;
            }, error => this.errorResponse(true));
        } else {
            this.remesaService.sendUpdate(this.remesa).subscribe(data => {
                this.itemForm.reset({});
                this.successResponse('La Remesa', 'Procesada', false);
                return data;
            }, error => this.errorResponse(true));
        }


    }
}

