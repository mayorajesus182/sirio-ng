import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-wf-pase-boveda-detail',
  templateUrl: './wf-pase-boveda-detail.component.html',
  styleUrls: ['./wf-pase-boveda-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFPaseABovedaDetailComponent extends FormBaseComponent implements OnInit {

  private opt_swal: SweetAlertOptions;
  public conos: ConoMonetario[] = [];
  workflow: string = undefined;

  constructor(
    spinner: NgxSpinnerService,
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
    private cajaTaquillaService: CajaTaquillaService,
    private cdr: ChangeDetectorRef) {
    super(undefined, injector);
  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      this.workflow = params.get('wf');
      let exp = params.get('exp');
      this.loadingDataForm.next(true);

      if (exp) {
        this.cajaTaquillaService.detailByExpediente(exp).subscribe(data => {
          this.data = data;
          // TODO: AGREGAR ETIQUETAS FALTANTES EN EL HTML
          this.conos = data.detalleEfectivo;
          this.cdr.detectChanges();
          this.loadingDataForm.next(false);
        });
      }
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
