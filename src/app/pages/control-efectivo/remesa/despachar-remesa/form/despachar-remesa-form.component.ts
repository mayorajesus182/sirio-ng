import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { MaterialRemesa, Remesa, RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';
import { TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import swal, { SweetAlertOptions } from 'sweetalert2';

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
    esTransportista: Boolean = false;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private rolService: RolService,
        private remesaService: RemesaService,
        private preferenciaService: PreferenciaService,
        private empleadoTransporteService: EmpleadoTransporteService,
        private transportistaService: TransportistaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = false;

        this.remesaService.get(id).subscribe(data => {
            this.remesa = data;
            this.buildForm(this.remesa);

            this.rolService.getByUsuario().subscribe(rol => {
                this.esTransportista = (rol.id === GlobalConstants.TRANSPORTISTA);








                
            });




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
    }
}
