import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
    selector: 'app-empleado-transporte-popup',
    templateUrl: './empleado-transporte-popup.component.html',
    styleUrls: ['./empleado-transporte-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EmpleadoTransportePopupComponent extends PopupBaseComponent implements OnInit {

    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    empleadoTransporte: EmpleadoTransporte = {} as EmpleadoTransporte;
    transportista: string;


    constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
        protected injector: Injector,
        private empleadoTransporteService: EmpleadoTransporteService,
        private tipoDocumentoService: TipoDocumentoService,
        private cdr: ChangeDetectorRef,
        dialogRef: MatDialogRef<EmpleadoTransportePopupComponent>,
        private fb: FormBuilder) {

        super(dialogRef, injector)
    }

    ngOnInit() {
        this.empleadoTransporte = this.defaults.payload;

        if (this.empleadoTransporte.id) {
            this.mode = 'global.edit';
        } else {
            this.defaults = {} as any;
        }
        console.log(this.empleadoTransporte);

        this.buildForm(this.empleadoTransporte)

        this.tipoDocumentoService.activesNaturales().subscribe(data => {
            this.tipoDocumentos.next(data);
            this.cdr.detectChanges();
        });

        if (!this.empleadoTransporte.id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.f.identificacion.valueChanges.subscribe(value => {
            if (!this.f.identificacion.errors && this.f.identificacion.value.length > 0) {
                this.identificacionExists(value);
            }
        });

    }

    buildForm(empleadoTransporte: EmpleadoTransporte) {

        this.itemForm = this.fb.group({
            id: new FormControl({ value: empleadoTransporte.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(empleadoTransporte.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            tipoDocumento: new FormControl(empleadoTransporte.tipoDocumento || undefined, [Validators.required]),
            identificacion: new FormControl(empleadoTransporte.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });

        // this.cdr.detectChanges();
    }

    private codigoExists(id) {
        this.empleadoTransporteService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    private identificacionExists(identificacion) {
        this.empleadoTransporteService.existsByTranportistaAndIdentificacion(this.empleadoTransporte.transportista, identificacion).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['identificacion'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.empleadoTransporte);
        this.saveOrUpdate(this.empleadoTransporteService, this.empleadoTransporte, 'El Empleado', this.isNew);
    }

}
