import { HttpParams } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-wf-pase-efectivo-detail',
  templateUrl: './wf-pase-efectivo-detail.component.html',
  styleUrls: ['./wf-pase-efectivo-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFPaseEfectivoDetailComponent extends FormBaseComponent implements OnInit {

  private opt_swal: SweetAlertOptions;
  workflow: string = undefined;

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
    private bovedaAgenciaService: BovedaAgenciaService) {
    super(undefined, injector);
  }

  ngOnInit() {
    this.workflow = this.route.snapshot.params['wf'];

    let exp = this.route.snapshot.params['exp'];

    this.loadingDataForm.next(true);

    this.bovedaAgenciaService.detailByExpediente(exp).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

    this.opt_swal = {};
    this.opt_swal.input = 'text';
    this.opt_swal.inputPlaceholder = 'Ingrese la observación';
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

  rollbackTask() {
    this.swalService.show('title.alert.workflow.return', 'text.warning.message', this.opt_swal).then((resp) => {

      if (resp.value) {

        let data = { id: this.workflow, observacion: resp.value };
        this.workflowService.rollback(data).subscribe(resp => {
          this.workflowService.notify.next(true);
          this.router.navigate(['/sirio/welcome']).then(data => {
            this.successResponse('La tarea', 'devuelta');
          });
        });
      }

    });
  }

}
