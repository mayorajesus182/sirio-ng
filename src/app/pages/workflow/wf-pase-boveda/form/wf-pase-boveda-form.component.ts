import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { CajaTaquilla, CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-wf-pase-boveda-form',
    templateUrl: './wf-pase-boveda-form.component.html',
    styleUrls: ['./wf-pase-boveda-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFPaseABovedaFormComponent extends FormBaseComponent implements OnInit {

    private opt_swal: SweetAlertOptions;
    movimientoEfectivo: MovimientoEfectivo = {} as MovimientoEfectivo;
    taquilla: Taquilla = {} as Taquilla;
    cajaTaquilla: CajaTaquilla = {} as CajaTaquilla;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    rol: Rol = {} as Rol;
    public conoSave: ConoMonetario[] = [];
    workflow: string = undefined;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private cajaTaquillaService: CajaTaquillaService,
        private movimientoEfectivoService: MovimientoEfectivoService,
        private monedaService: MonedaService,
        private taquillaService: TaquillaService,
        private workflowService: WorkflowService,
        private conoMonetarioService: ConoMonetarioService,
        private rolService: RolService,
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

                this.cajaTaquillaService.getByExpediente(exp).subscribe(data => {
                    this.cajaTaquilla = data;
                    this.buildForm(this.cajaTaquilla);

                    this.conoMonetarioService.activesWithDisponibleSaldoTaquillaByMoneda(data.moneda).subscribe(conoData => {

                        conoData = conoData.map(c => {
                            let val = data.detalleEfectivo.filter(c1 => c1.id.cono == c.id)[0];
                            c.cantidad = val ? val.cantidad : 0;
                            c.disponible = val ? c.disponible + val.cantidad : c.disponible;
                            return c;
                        })

                        this.conos.next(conoData);
                        this.updateValuesErrors(this.conos[0]);
                        this.cdr.detectChanges();
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

    buildForm(cajaTaquilla: CajaTaquilla) {
        this.itemForm = this.fb.group({
            monto: new FormControl(cajaTaquilla.monto || undefined, Validators.required),
        });
    }


    updateValuesErrors(item: ConoMonetario) {

        this.conos.subscribe(c => {
            this.f.monto.setValue(c.filter(c1 => c1.cantidad > 0).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
            this.conoSave = c.filter(c => c.cantidad > 0);
            this.cdr.detectChanges();
        });

        if (item && item.cantidad > item.disponible) {
            this.itemForm.controls['monto'].setErrors({
                cantidad: true
            });
            this.f.monto.setValue(0.0);
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
        this.swalService.show('message.resendTask', '', this.opt_swal).then((resp) => {

            if (resp.value) {
                let data = { id: this.workflow, observacion: resp.value };
                this.workflowService.approved(data).subscribe(resp => {
                    this.workflowService.notify.next(true);
                    this.router.navigate(['/sirio/welcome']).then(data => {
                        this.successResponse('La Tarea', 'Reenviada', true);
                    });
                });
            }

        });
    }

    overrideTask() {
        this.swalService.show('message.overrideTask', '', this.opt_swal).then((resp) => {

            if (resp.value) {
                let data = { id: this.workflow, observacion: resp.value };
                this.workflowService.annulled(data).subscribe(resp => {
                    this.workflowService.notify.next(true);
                    this.router.navigate(['/sirio/welcome']).then(data => {
                        this.successResponse('La Tarea', 'Anulada', true);
                    });
                });
            }

        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cajaTaquilla);
        this.cajaTaquilla.detalleEfectivo = this.conoSave;

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        if (!existsDifference) {
            this.saveOrUpdate(this.cajaTaquillaService, this.cajaTaquilla, 'El Pase a Bóveda', this.isNew);
        } else {
            this.swalService.show('Sobrepasó una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });
        }
    }

}
