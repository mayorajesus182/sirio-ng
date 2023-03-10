import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { BovedaAgencia, BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { MovimientoEfectivo } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { Taquilla } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-wf-pase-efectivo-form',
    templateUrl: './wf-pase-efectivo-form.component.html',
    styleUrls: ['./wf-pase-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFPaseEfectivoFormComponent extends FormBaseComponent implements OnInit {

    private opt_swal: SweetAlertOptions;
    bovedaAgencia: BovedaAgencia = {} as BovedaAgencia;
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
        private bovedaAgenciaService: BovedaAgenciaService,
        private workflowService: WorkflowService,
        private rolService: RolService,
        private saldoAgenciaService: SaldoAgenciaService,
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

                this.bovedaAgenciaService.getByExpediente(exp).subscribe(data => {
                    this.bovedaAgencia = data;
                    this.buildForm(this.bovedaAgencia);

                    this.saldoAgenciaService.activesWithDisponibleSaldoAgenciaByMoneda(data.moneda).subscribe(conoData => {

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
        this.opt_swal.inputPlaceholder = 'Ingrese una Observaci??n';
        this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm(bovedaAgencia: BovedaAgencia) {
        this.itemForm = this.fb.group({
            monto: new FormControl(bovedaAgencia.monto || undefined),
        });
    }

    updateValuesErrors(item: ConoMonetario) {

        this.conos.subscribe(c => {
            this.f.monto.setValue(c.filter(c1 => c1.cantidad != undefined).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
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
                'La observaci??n es requerida!'
            );
        }
    }

    resendTask() {
        this.swalService.show('message.resendTask', '', this.opt_swal).then((resp) => {
            this.workflowService.notify.next(false);
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
            this.workflowService.notify.next(false);
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

        this.updateData(this.bovedaAgencia);
        this.bovedaAgencia.detalleEfectivo = this.conoSave;


        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        if (!existsDifference) {
            this.saveOrUpdate(this.bovedaAgenciaService, this.bovedaAgencia, 'El Pase de Efectivo', this.isNew);
        } else {

            this.swalService.show('Sobrepas?? una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
                if (!resp.dismiss) { }
            });
        }
    }
}
