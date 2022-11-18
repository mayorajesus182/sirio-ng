import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { SaldoAcopioService } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { MaterialRemesa, SolicitudRemesa, SolicitudRemesaService } from 'src/@sirio/domain/services/control-efectivo/solicitud-remesa.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { Material } from 'src/@sirio/domain/services/transporte/material.service';
import { MaterialTransporteService } from 'src/@sirio/domain/services/transporte/materiales/material-transporte.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-wf-gestion-remesa-receptor-form',
    templateUrl: './wf-gestion-remesa-receptor-form.component.html',
    styleUrls: ['./wf-gestion-remesa-receptor-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFGestionRemesaReceptorFormComponent extends FormBaseComponent implements OnInit {

    public materialForm: FormGroup;
    private opt_swal: SweetAlertOptions;
    solicitudRemesa: SolicitudRemesa = {} as SolicitudRemesa;
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
    public materiales = new BehaviorSubject<Material[]>([]);
    materialUtilizadoList: ReplaySubject<MaterialRemesa[]> = new ReplaySubject<MaterialRemesa[]>();
    rol: Rol = {} as Rol;
    public conoSave: ConoMonetario[] = [];
    preferencia: Preferencia = {} as Preferencia;
    workflow: string = undefined;
    saldoDisponible: number = 0;
    materialRemesaList: MaterialRemesa[] = [];

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private workflowService: WorkflowService,
        private rolService: RolService,
        private solicitudRemesaService: SolicitudRemesaService,
        private saldoAcopioService: SaldoAcopioService,
        private viajeTransporteService: ViajeTransporteService,
        private materialTransporteService: MaterialTransporteService,
        private preferenciaService: PreferenciaService,
        private conoMonetarioService: ConoMonetarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.route.paramMap.subscribe(params => {

            this.workflow = params.get('wf');
            let exp = params.get('exp');
            this.loadingDataForm.next(true);

            if (exp) {

                this.isNew = false;

                this.rolService.getByWorkflow(this.workflow).subscribe(data => {
                    this.rol = data;
                });

                this.solicitudRemesaService.getByExpediente(exp).subscribe(data => {
                    this.solicitudRemesa = data;
                    this.buildForm(this.solicitudRemesa);
                    this.buildFormMateriales();

                    this.conoMonetarioService.activesWithDisponibleSaldoAcopioByMoneda(this.solicitudRemesa.moneda).subscribe(data => {
                        this.conos.next(data);
                    });

                    this.preferenciaService.get().subscribe(data => {
                        this.preferencia = data;

                        //Si es moneda local se bucan los viajes con bolivares mayores a cero, de otro modo se buscan viajes con divisas meyores a cero
                        if (this.preferencia.monedaConoActual === this.solicitudRemesa.moneda) {

                            this.viajeTransporteService.allWithCostoByTransportista(this.solicitudRemesa.receptor).subscribe(data => {
                                this.viajes.next(data);
                            });

                            this.materialTransporteService.allWithCostoByTransportista(this.solicitudRemesa.receptor).subscribe(data => {
                                this.materiales.next(data);
                                console.log(this.materiales);
                                
                            });

                        } else {

                            this.viajeTransporteService.allWithCostoDivisaByTransportista(this.solicitudRemesa.receptor).subscribe(data => {
                                this.viajes.next(data);
                            });

                            this.materialTransporteService.allWithCostoDivisaByTransportista(this.solicitudRemesa.receptor).subscribe(data => {
                                this.materiales.next(data);
                            });
                        }
                    });

                    this.cdr.markForCheck();
                    this.loadingDataForm.next(false);
                    this.applyFieldsDirty();
                    this.cdr.detectChanges();
                });
            }
        });

        this.opt_swal = {};
        this.opt_swal.input = 'text';
        this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm(solicitudRemesa: SolicitudRemesa) {
        this.itemForm = this.fb.group({
            viaje: new FormControl(solicitudRemesa.viaje || undefined, [Validators.required]),
            plomos: new FormControl(solicitudRemesa.plomos || undefined, [Validators.required]),
            montoEnviado: new FormControl(solicitudRemesa.montoEnviado || undefined, [Validators.required]),
        });
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

    obtenerSaldo() {

        this.saldoDisponible = 0;
        this.f.montoEnviado.setValue(undefined);

        this.saldoAcopioService.getSaldoByMoneda(this.solicitudRemesa.moneda).subscribe(data => {
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

    resendTask() {
        this.swalService.show('message.resendTask', this.rol.nombre, this.opt_swal).then((resp) => {

            if (resp.value) {
                let data = { id: this.workflow, observacion: resp.value };
                this.workflowService.approved(data).subscribe(resp => {
                    this.workflowService.notify.next(true);
                    this.router.navigate(['/sirio/welcome']).then(data => {
                        this.successResponse('La tarea', 'reenviada');
                    });
                });
            }

        });
    }

    overrideTask() {
        this.swalService.show('message.overrideTask', this.rol.nombre, this.opt_swal).then((resp) => {

            if (resp.value) {
                let data = { id: this.workflow, observacion: resp.value };
                this.workflowService.annulled(data).subscribe(resp => {
                    this.workflowService.notify.next(true);
                    this.router.navigate(['/sirio/welcome']).then(data => {
                        this.successResponse('La tarea', 'anulada');
                    });
                });
            }

        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.solicitudRemesa);
        //  this.solicitudRemesa.detalleEfectivo = this.conoSave;

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        if (!existsDifference) {
            this.saveOrUpdate(this.solicitudRemesaService, this.solicitudRemesa, 'El Pase de Efectivo', this.isNew);
        } else {

            this.swalService.show('Sobrepasó una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });
        }
    }
}
