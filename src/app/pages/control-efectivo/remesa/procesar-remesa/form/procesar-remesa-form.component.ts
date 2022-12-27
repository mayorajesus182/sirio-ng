import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
    selector: 'app1-procesar-remesa-form',
    templateUrl: './procesar-remesa-form.component.html',
    styleUrls: ['./procesar-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ProcesarRemesaFormComponent extends FormBaseComponent implements OnInit {

    plomoList = [];
    materialList: Material[] = [];
    plomoCtrl = new FormControl([], [Validators.required]);
    public materialForm: FormGroup;
    private opt_swal: SweetAlertOptions;
    remesa: Remesa = {} as Remesa;
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
    public materiales = new BehaviorSubject<Material[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    materialUtilizadoList: ReplaySubject<MaterialRemesa[]> = new ReplaySubject<MaterialRemesa[]>();
    public empleados = new BehaviorSubject<EmpleadoTransporte[]>([]);
    rol: Rol = {} as Rol;
    public conoSave: ConoMonetario[] = [];
    preferencia: Preferencia = {} as Preferencia;
    workflow: string = undefined;
    saldoDisponible: number = 0;
    materialRemesaList: MaterialRemesa[] = [];
    esTransportista: Boolean = false;

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
        private preferenciaService: PreferenciaService,
        private empleadoTransporteService: EmpleadoTransporteService,
        private transportistaService: TransportistaService,
        private conoMonetarioService: ConoMonetarioService,
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
                // this.buildForm(this.remesa);
                this.buildFormMateriales();
                this.loadingDataForm.next(false);
                // this.applyFieldsDirty();
                //  this.cdr.markForCheck();

                // Si quien va a procesar la solicitud es transportista (Centro de Acopio), se busca el cono correspondiente, los materiales y viajes según la moneda 
                if (this.esTransportista) {

                    this.conoMonetarioService.activesWithDisponibleSaldoAcopioByMoneda(this.remesa.moneda).subscribe(conoData => {

                        conoData = conoData.map(c => {
                            let val = this.remesa.detalleEfectivo.filter(c1 => c1.id.cono == c.id)[0];
                            c.cantidad = val ? val.cantidad : 0;
                            c.disponible = val ? c.disponible + val.cantidad : c.disponible;
                            return c;
                        })

                        this.conos.next(conoData);
                        this.updateValuesErrors(this.conos[0]);
                        this.cdr.detectChanges();
                    });

                    this.preferenciaService.get().subscribe(pref => {
                        this.preferencia = pref;

                        console.log(' this.preferencia.monedaConoActual ', this.preferencia.monedaConoActual);
                        console.log(' this.remesa.moneda ', this.remesa.moneda);

                        // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
                        if (this.preferencia.monedaConoActual === this.remesa.moneda) {

                            this.viajeTransporteService.allWithCostoByTransportista(this.remesa.receptor).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });

                            this.materialTransporteService.allWithCostoByTransportista(this.remesa.receptor).subscribe(mtt => {
                                this.materialList = mtt;
                                this.materiales.next(mtt);
                            });

                        } else {

                            this.viajeTransporteService.allWithCostoDivisaByTransportista(this.remesa.receptor).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });

                            this.materialTransporteService.allWithCostoDivisaByTransportista(this.remesa.receptor).subscribe(mtt => {
                                this.materialList = mtt;
                                this.materiales.next(mtt);
                            });
                        }
                    });

                    this.remesa.materiales.forEach(mr => {
                        let materialRemesa = {} as MaterialRemesa;
                        this.updateDataFromValues(materialRemesa, mr);
                        this.materialRemesaList.push(materialRemesa);
                        this.materialUtilizadoList.next(this.materialRemesaList.slice());
                        this.cdr.detectChanges();
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


                    this.preferenciaService.get().subscribe(pref => {
                        this.preferencia = pref;

                        if (this.preferencia.monedaConoActual === this.remesa.moneda) {

                            this.viajeTransporteService.allWithCostoByTransportista(this.remesa.transportista).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });

                        } else {

                            this.viajeTransporteService.allWithCostoDivisaByTransportista(this.remesa.transportista).subscribe(vjt => {
                                this.viajes.next(vjt);
                            });
                        }
                    });

                    this.conoMonetarioService.activesWithDisponibleSaldoPrincipalByMoneda(this.remesa.moneda).subscribe(conoData => {

                        conoData = conoData.map(c => {
                            let val = this.remesa.detalleEfectivo.filter(c1 => c1.id.cono == c.id)[0];
                            c.cantidad = val ? val.cantidad : 0;
                            c.disponible = val ? c.disponible + val.cantidad : c.disponible;
                            return c;
                        })

                        this.conos.next(conoData);
                        this.updateValuesErrors(this.conos[0]);
                        this.cdr.detectChanges();
                    });

                }
            });

            // this.cdr.markForCheck();
            // this.loadingDataForm.next(false);
            // this.applyFieldsDirty();
            this.cdr.detectChanges();
        });

        // this.opt_swal = {};
        // this.opt_swal.input = 'text';
        // this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        // this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm() {
        this.itemForm = this.fb.group({
            cajasBolsas: new FormControl(this.remesa.cajasBolsas || undefined),
            transportista: new FormControl(this.remesa.transportista || undefined),
            viaje: new FormControl(this.remesa.viaje || undefined, [Validators.required]),
            montoEnviado: new FormControl(this.remesa.montoEnviado || undefined, [Validators.required]),
            responsables: new FormControl(this.remesa.responsables || undefined, [Validators.required]),
        });

        // Sólo se escoge la transportista cuando quien procesa es el centro de acopio, es decir, esto sólo pasará si la pantalla se muestra al centro de acopio
        this.f.transportista.valueChanges.subscribe(value => {


            this.empleadoTransporteService.allByTransportista(value).subscribe(emp => {
                this.empleados.next(emp);
            });

            // this.preferenciaService.get().subscribe(pref => {
            //     this.preferencia = pref;

                // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
                if (this.preferencia.monedaConoActual === this.remesa.moneda) {

                    this.viajeTransporteService.allWithCostoByTransportista(value).subscribe(vjt => {
                        this.viajes.next(vjt);
                    });

                } else {

                    this.viajeTransporteService.allWithCostoDivisaByTransportista(value).subscribe(vjt => {
                        this.viajes.next(vjt);
                    });
                }
            });
        // });


        this.plomoCtrl.setValue(this.remesa.plomos ? this.remesa.plomos.split(',') : []);
        this.plomoList = this.remesa.plomos ? this.remesa.plomos.split(',') : [];

        this.onLoadMaterialesUtilizados();

        this.cdr.detectChanges();
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

    onLoadMaterialesUtilizados() {
        this.materialUtilizadoList.subscribe(list => {
            console.log(' cambio materiales utilizados ', list);
            console.log('  materiales a utilizar ', this.materialList);

            if (!list || list.length == 0) {
                this.materiales.next(this.materialList);
            } else {
                console.log(list.map(mu => mu.material));

                this.materiales.next(
                    this.materialList.filter(m => !list.map(mu => mu.material).includes(m.id))
                );
            }
        })
    }

    getNombreMaterial(id: string) {
        if (!this.materialList || this.materialList.length == 0) {
            return '';
        }
        return this.materialList.filter(m => m.id == id).map(m => m.id + " - " + m.nombre);
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

    removePlomo(plomo: string) {
        const index = this.plomoList.indexOf(plomo);
        if (index >= 0) {
            this.plomoList.splice(index, 1);
        }
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
        this.cdr.detectChanges();

    }


    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.plomoList, event.previousIndex, event.currentIndex);
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
            this.remesaService.processCreate(this.remesa).subscribe(data => {
                this.itemForm.reset({});
                this.successResponse('La Remesa', 'Procesada', false);
                return data;
            }, error => this.errorResponse(true));
        } else {
            this.remesaService.processUpdate(this.remesa).subscribe(data => {
                this.itemForm.reset({});
                this.successResponse('La Remesa', 'Procesada', false);
                return data;
            }, error => this.errorResponse(true));
        }

    }
}

