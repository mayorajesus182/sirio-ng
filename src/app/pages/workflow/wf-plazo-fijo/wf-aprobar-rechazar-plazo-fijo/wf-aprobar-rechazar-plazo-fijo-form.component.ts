import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { PlazoFijoService } from 'src/@sirio/domain/services/persona/plazo-fijo/plazo-fijo.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'app-wf-aprobar-rechazar-plazo-fijo-form',
  templateUrl: './wf-aprobar-rechazar-plazo-fijo-form.component.html',
  styleUrls: ['./wf-aprobar-rechazar-plazo-fijo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFAprobarRechazarPlazoFijoFormComponent extends FormBaseComponent implements OnInit {

  workflow: string = undefined;
  rol: Rol = {} as Rol;
  total: number = 0;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
    private plazoFijoService: PlazoFijoService,
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

        this.rolService.getByWorkflow(this.workflow).subscribe(data => {
          this.rol = data;
        });

        this.plazoFijoService.detailByExpediente(exp).subscribe(data => {
          this.data = data;
          this.total = this.data.monto + this.data.interes;
          this.cdr.detectChanges();
          this.buildForm();
          this.loadingDataForm.next(false);
        });
      }
    });



  }

  buildForm() {

    this.itemForm = this.fb.group({
      tasa: new FormControl(this.data.tasa || undefined, [Validators.required]),
      monto: new FormControl(this.data.monto || undefined, [Validators.required]),
    });

    this.f.monto.valueChanges.subscribe(val => {
      if (val && (val != '')) {
        this.data.interes = val * this.f.tasa.value / 100.0;
        this.total = val + this.data.interes;
      }
    });

    this.f.tasa.valueChanges.subscribe(val => {
      if (val && (val != '')) {
        this.data.interes = val * this.f.monto.value / 100.0;
        this.total = this.f.monto.value + this.data.interes;
      }
    });
  }

  approvePlazo() {

    let mensaje = 'Por un Monto de: <b>' + formatNumber(this.data.monto, 'es', '1.2') + ' ' + this.data.moneda + '</b> <br> ';
    mensaje += 'A una Tasa de: <b>' + formatNumber(this.data.tasa, 'es', '1.2') + ' %</b> <br> ';
    mensaje += 'Por un Plazo de: <b>' + this.data.plazo + '</b> <br> ';

    this.swalService.show('¿Desea Aprobar el Plazo Fijo?', undefined, { html: mensaje }).then((resp) => {
      if (!resp.dismiss) {

        let plazo = { id: this.data.id, monto: this.f.monto.value, tasa: this.f.tasa.value, interes: this.data.interes, estatus: GlobalConstants.APROBADO }
        this.plazoFijoService.updateTasaMontoStatus(plazo).subscribe(result => {

          let data = { id: this.workflow, observacion: 'Aprobada' };
          this.workflowService.approved(data).subscribe(resp => {
            this.workflowService.notify.next(true);

            this.router.navigate(['/sirio/welcome']).then(data => {
              this.successResponse('La Tarea', 'Aprobada', true);
            });
          });
        }, error => this.errorResponse(true));
      }
    });
  }

  rejectPlazo() {

    this.swalService.show('¿Desea Rechazar el Plazo Fijo?', '').then((resp) => {
      if (!resp.dismiss) {
        let plazo = { id: this.data.id, monto: this.data.monto, tasa: this.data.tasa, interes: this.data.interes, estatus: GlobalConstants.RECHAZADO }
        this.plazoFijoService.updateTasaMontoStatus(plazo).subscribe(result => {

          let data = { id: this.workflow, observacion: 'Rechazada' };
          this.workflowService.approved(data).subscribe(resp => {
            this.workflowService.notify.next(true);
            this.router.navigate(['/sirio/welcome']).then(data => {
              this.successResponse('La Tarea', 'Rechazada', true);
            });
          });
        }, error => this.errorResponse(true));
      }
    });
  }

}
