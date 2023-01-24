import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CajaTaquilla, CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-wf-cierre-taquilla-detail',
    templateUrl: './wf-cierre-taquilla-detail.component.html',
    styleUrls: ['./wf-cierre-taquilla-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFCierreTaquillaDetailComponent extends FormBaseComponent implements OnInit {

    saldos = new BehaviorSubject<CajaTaquilla[]>([]);
    preferencias: Preferencia = {} as Preferencia;
    rol: Rol = {} as Rol;
    diferencia: number = 0
    workflow: string = undefined;
    private opt_swal: SweetAlertOptions;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private rolService: RolService,
        private cajaTaquillaService: CajaTaquillaService,
        private preferenciaService: PreferenciaService,
        private workflowService: WorkflowService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }


    ngOnInit() {

        this.route.paramMap.subscribe(params => {

            this.workflow = params.get('wf');
            let exp = params.get('exp');
            this.loadingDataForm.next(true);

            if (exp) {

                this.rolService.getByWorkflow(this.workflow).subscribe(data => {
                    this.rol = data;                    
                });

                this.preferenciaService.get().subscribe(data => {
                    this.preferencias = data;
                });

                this.cajaTaquillaService.allByExpediente(exp).subscribe(data => {
                    this.saldos.next(data);                                       
                });
            }
        });

        this.opt_swal = {};
        this.opt_swal.input = 'text';
        this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;

    }

    preConfirmFunt(obs: string) {

        if (!obs || obs.trim().length == 0) {
            swal.showValidationMessage(
                'La observación es requerida!'
            );
        }
    }


    approveTask() {
        this.swalService.show('message.approveTask', '').then((resp) => {

            if (resp.value) {
              let data = { id: this.workflow, observacion: 'Conforme' };
              this.workflowService.approved(data).subscribe(resp => {
                this.workflowService.notify.next(true);
                this.router.navigate(['/sirio/welcome']).then(data => {
                  this.successResponse('La Tarea', 'Aprobada', true);
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
}
