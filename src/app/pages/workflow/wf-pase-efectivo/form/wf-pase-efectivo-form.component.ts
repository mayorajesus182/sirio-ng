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
import { Taquilla } from 'src/@sirio/domain/services/organizacion/taquilla.service';
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
    workflow: string = undefined;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private bovedaAgenciaService: BovedaAgenciaService,
        private workflowService: WorkflowService,
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
                this.bovedaAgenciaService.getByExpediente(exp).subscribe(data => {
                    this.bovedaAgencia = data;
                    this.buildForm(this.bovedaAgencia);

                    this.conoMonetarioService.activesWithDisponibleSaldoAgenciaByMoneda(data.moneda).subscribe(conoData => {
                        this.conos.next(conoData);



                    //    conoData.forEach(function (conoVacio) { data.detalleEfectivo.forEach(function (conoregistrado) { console.log('aquiiiiiiii') }) });


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
        this.opt_swal.inputPlaceholder = 'Ingrese la observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm(bovedaAgencia: BovedaAgencia) {
        this.itemForm = this.fb.group({
            monto: new FormControl(bovedaAgencia.monto || undefined, Validators.required),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.bovedaAgencia);
        this.saveOrUpdate(this.bovedaAgenciaService, this.bovedaAgencia, 'El Pase de Efectivo', false);
    }

    preConfirmFunt(obs: string) {

        if (!obs || obs.trim().length == 0) {
            swal.showValidationMessage(
                'La observación es requerida!'
            );
        }
    }

    resendTask() {
        this.swalService.show('title.alert.workflow.return', 'text.warning.message', this.opt_swal).then((resp) => {

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

    annularTask() {
        this.swalService.show('title.alert.workflow.return', 'text.warning.message', this.opt_swal).then((resp) => {

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

}
