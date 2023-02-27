import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { PlazoDPF } from 'src/@sirio/domain/services/configuracion/plazo-fijo/plazo.service';
import { TasaDPF } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tasa-dpf.service';
import { TipoRenovacion } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tipo-renovacion.service';
import { TipoProducto } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoSubproducto } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { CuentaBanco } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { PlazoFijo, PlazoFijoService } from 'src/@sirio/domain/services/persona/plazo-fijo/plazo-fijo.service';
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

  public persona: Persona = {} as Persona;
  public tasas = new BehaviorSubject<TasaDPF[]>([]);
  public tipoRenovaciones = new BehaviorSubject<TipoRenovacion[]>([]);
  public productos = new BehaviorSubject<TipoProducto[]>([]);
  public subproductos = new BehaviorSubject<TipoSubproducto[]>([]);
  public plazos = new BehaviorSubject<PlazoDPF[]>([]);
  public cuentas = new BehaviorSubject<CuentaBanco[]>([]);
  public cuentasCapitalInteres = new BehaviorSubject<CuentaBanco[]>([]);
  plazoFijo: PlazoFijo = {} as PlazoFijo;
  todayValue: moment.Moment;
  workflow: string = undefined;
  rol: Rol = {} as Rol;

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
          this.cdr.detectChanges();
          this.buildForm();
          this.loadingDataForm.next(false);
        });
      }
    });
  }

  buildForm() {

    this.itemForm = this.fb.group({
        id: new FormControl(this.data.id),
        porcentaje: new FormControl(this.data.porcentaje || undefined, [Validators.required]),
    });
}

  save() {
    this.swalService.show('¿Desea Modificar la Tasa?', 'Nueva Tasa: '+ formatNumber(this.f.porcentaje.value, 'es', '1.2') + ' %').then((resp) => {

      if (resp.value) {

        this.updateData(this.plazoFijo);

        this.plazoFijoService.updatePorcentajeTasa(this.plazoFijo).subscribe(data => {
          this.successResponse('El Porcentaje de la Tasa', 'Actualizado', true);
          return data;
        }, error => this.errorResponse(true));

      }

    });

  }

}
