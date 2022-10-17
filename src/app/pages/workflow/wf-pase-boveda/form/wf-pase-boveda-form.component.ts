import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { CajaTaquilla, CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
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
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {


        this.route.paramMap.subscribe(params => {

            this.workflow = params.get('wf');
            let exp = params.get('exp');
            this.loadingDataForm.next(true);

            if (exp) {
                this.cajaTaquillaService.getByExpediente(exp).subscribe(data => {
                    this.cajaTaquilla = data;
                    this.buildForm(this.cajaTaquilla);
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

    buildForm(cajaTaquilla: CajaTaquilla) {
        this.itemForm = this.fb.group({
            monto: new FormControl(cajaTaquilla.monto || undefined, Validators.required),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cajaTaquilla);           
        this.saveOrUpdate(this.cajaTaquillaService, this.cajaTaquilla, 'El Pase a Bóveda', this.isNew);
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
