import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { SaldoAcopioService } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { MaterialRemesa, Remesa, RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { Material } from 'src/@sirio/domain/services/transporte/material.service';
import { MaterialTransporteService } from 'src/@sirio/domain/services/transporte/materiales/material-transporte.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';

@Component({
    selector: 'app-despachar-remesa-form',
    templateUrl: './despachar-remesa-form.component.html',
    styleUrls: ['./despachar-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DespacharRemesaFormComponent extends FormBaseComponent implements OnInit {

    public materialForm: FormGroup;
    private opt_swal: SweetAlertOptions;
    remesa: Remesa = {} as Remesa;
    public empleados = new BehaviorSubject<EmpleadoTransporte[]>([]);
    rol: Rol = {} as Rol;
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
        private remesaService: RemesaService,
        private saldoAcopioService: SaldoAcopioService,
        private viajeTransporteService: ViajeTransporteService,
        private materialTransporteService: MaterialTransporteService,
        private preferenciaService: PreferenciaService,
        private empleadoTransporteService: EmpleadoTransporteService,
        private conoMonetarioService: ConoMonetarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = false;

        this.remesaService.get(id).subscribe(data => {
            this.remesa = data;
            this.buildForm(this.remesa);
            this.buildFormMateriales();

            this.preferenciaService.get().subscribe(pref => {
                this.preferencia = pref;
            });

            this.empleadoTransporteService.allByTransportista(this.remesa.receptor).subscribe(emp => {
                this.empleados.next(emp);
            });

            this.cdr.markForCheck();
            this.loadingDataForm.next(false);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });

        this.opt_swal = {};
        this.opt_swal.input = 'text';
        this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm(remesa: Remesa) {
        this.itemForm = this.fb.group({
            responsables: new FormControl(remesa.responsables || undefined, [Validators.required]),
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

    preConfirmFunt(obs: string) {

        if (!obs || obs.trim().length == 0) {
            swal.showValidationMessage(
                'La observación es requerida!'
            );
        }
    }


    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.remesa);
        //  this.remesa.detalleEfectivo = this.conoSave;


        this.remesaService.dispatch(this.remesa.id, this.remesa.responsables).subscribe(data => {
            this.itemForm.reset({});
            this.successResponse('La Remesa fue', 'Despachada', false);
            return data;
        }, error => this.errorResponse(true));



      //  this.saveOrUpdate(this.remesaService, this.remesa, 'La Remesa', this.isNew);

        // if (!existsDifference) {
        //     this.saveOrUpdate(this.remesaService, this.remesa, 'El Pase de Efectivo', this.isNew);
        // } else {

        //     this.swalService.show('Sobrepasó una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
        //         if (!resp.dismiss) { }
        //     });
        // }
    }
}
