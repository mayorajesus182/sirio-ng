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
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { Viaje } from 'src/@sirio/domain/services/transporte/viaje.service';
import { ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
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
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    public viajes = new BehaviorSubject<Viaje[]>([]);
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
        private viajeTransporteService: ViajeTransporteService,
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


            console.log(this.remesa);
            

            this.rolService.getByUsuario().subscribe(rol => {
                this.esTransportista = (rol.id === GlobalConstants.TRANSPORTISTA);

                this.rolService.getByUsuario().subscribe(rol => {
                    this.esTransportista = (rol.id === GlobalConstants.TRANSPORTISTA);

                    // Si quien va a procesar la solicitud es transportista (Centro de Acopio), se buscan los viajes de esa transportista según la moneda 
                    if (this.esTransportista) {
                        this.loadViajesAndEmpleados(this.remesa.receptor);
                    } else {
                        this.transportistaService.actives().subscribe(trans => {
                            this.transportistas.next(trans);
                            this.loadViajesAndEmpleados(this.remesa.transportista);
                        });
                    }
                });
            });

            this.preferenciaService.get().subscribe(pref => {
                this.preferencia = pref;
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

    loadViajesAndEmpleados(value: string) {

        this.empleadoTransporteService.allByTransportista(value).subscribe(emp => {
            this.empleados.next(emp);
        });

        this.preferenciaService.get().subscribe(pref => {
            this.preferencia = pref;
            // Si es moneda local se bucan los viajes y materiales con bolivares mayores a cero, de otro modo se buscan viajes y materiales con divisas meyores a cero
            if (this.preferencia.monedaConoActual === this.remesa.moneda) {

                this.viajeTransporteService.allWithCostoByTransportista(value).subscribe(vjt => {
                    this.viajes.next(vjt);
                });

            } else {

                this.viajeTransporteService.allWithCostoDivisaByTransportista(value).subscribe(vjt => {
                    this.viajes.next(vjt);
                });
            }
        });
    }

    buildForm(remesa: Remesa) {
        this.itemForm = this.fb.group({
            transportista: new FormControl(remesa.transportista || undefined),
            viaje: new FormControl(remesa.viaje || undefined, [Validators.required]),
            responsables: new FormControl(remesa.responsables || undefined, [Validators.required]),
        });

        // Sólo se escoge la transportista cuando quien procesa es el centro de acopio, es decir, esto sólo pasará si la pantalla se muestra al centro de acopio
        this.f.transportista.valueChanges.subscribe(value => {
            this.loadViajesAndEmpleados(value);
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


        // this.remesaService.dispatch(this.remesa.id, this.remesa.responsables).subscribe(data => {
        //     this.itemForm.reset({});
        //     this.successResponse('La Remesa', 'Despachada', false);
        //     return data;
        // }, error => this.errorResponse(true));
    }
}
