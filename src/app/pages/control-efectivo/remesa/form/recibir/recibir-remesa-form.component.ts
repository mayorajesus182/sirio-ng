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

@Component({
    selector: 'app-recibir-remesa-form',
    templateUrl: './recibir-remesa-form.component.html',
    styleUrls: ['./recibir-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RecibirRemesaFormComponent extends FormBaseComponent implements OnInit {

    public materialForm: FormGroup;
    private opt_swal: SweetAlertOptions;
    remesa: Remesa = {} as Remesa;
    public conos = new BehaviorSubject<ConoMonetario[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
    public materiales = new BehaviorSubject<Material[]>([]);
    materialUtilizadoList: ReplaySubject<MaterialRemesa[]> = new ReplaySubject<MaterialRemesa[]>();
    rol: Rol = {} as Rol;
    public conoSave: ConoMonetario[] = [];
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

            console.log( 'datooooooooooosssssssssss', data);
            

            this.cdr.markForCheck();
            this.loadingDataForm.next(false);
            this.applyFieldsDirty();
            this.cdr.detectChanges();
        });
        //     }
        // });

        this.opt_swal = {};
        this.opt_swal.input = 'text';
        this.opt_swal.inputPlaceholder = 'Ingrese una Observación';
        this.opt_swal.preConfirm = this.preConfirmFunt;
    }

    buildForm(remesa: Remesa) {
        this.itemForm = this.fb.group({
            montoRecibido: new FormControl(remesa.montoRecibido || undefined, [Validators.required]),
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

    addMaterial() {
        if (this.materialForm.invalid)
            return;

        let materialRemesa = {} as MaterialRemesa;
        this.updateDataFromValues(materialRemesa, this.materialForm.value);
        this.materialRemesaList.push(materialRemesa);
        this.materialUtilizadoList.next(this.materialRemesaList.slice());
        this.mf.material.setValue(undefined);
        this.mf.cantidad.setValue(undefined);
        this.cdr.detectChanges();
    }

    deleteMaterial(row) {
        this.materialRemesaList.forEach((e, index) => {
            if (e.material === row.material) {
                this.materialRemesaList.splice(index, 1);
                this.materialUtilizadoList.next(this.materialRemesaList.slice());
            }
            this.cdr.detectChanges();
        });
    }

    obtenerSaldo() {

        this.saldoDisponible = 0;
        this.f.montoRecibido.setValue(undefined);

        this.saldoAcopioService.getSaldoByMoneda(this.remesa.moneda).subscribe(data => {
            this.saldoDisponible = data;
            this.cdr.detectChanges();
        });
    }

    updateValuesErrors(item: ConoMonetario) {

        this.f.montoRecibido.setValue(0.0);

        this.conos.subscribe(c => {
            this.f.montoRecibido.setValue(c.filter(c1 => c1.cantidad != undefined).map(c2 => c2.cantidad * c2.denominacion).reduce((a, b) => a + b));
            this.conoSave = c.filter(c => c.cantidad > 0);
            this.cdr.detectChanges();
        });

        if (item && item.cantidad > item.disponible) {
            this.itemForm.controls['montoRecibido'].setErrors({
                cantidad: true
            });
            this.f.montoRecibido.setValue(0.0);
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


    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.remesa);
        //  this.remesa.detalleEfectivo = this.conoSave;

        let existsDifference = false;

        this.conoSave.filter(c => { if (c.cantidad > c.disponible) { existsDifference = true } })

        this.remesa.materiales = this.materialRemesaList;
        this.remesa.detalleEfectivo = this.conoSave;
        console.log(this.remesa);


        this.remesaService.receive(this.remesa).subscribe(data => {
            this.itemForm.reset({});
            this.successResponse('La Remesa fue', 'Recibida', false);
            return data;
        }, error => this.errorResponse(true));

    }
}
