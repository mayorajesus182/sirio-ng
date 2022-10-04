import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
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

    empleadoTransporte: EmpleadoTransporte = {} as EmpleadoTransporte;
    transportista: string;

    // a: PerfectScrollbar;


    constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
        protected injector: Injector,
        private empleadoTransporteService: EmpleadoTransporteService,
        dialogRef: MatDialogRef<EmpleadoTransportePopupComponent>,
        private fb: FormBuilder) {

        super(dialogRef, injector)
    }

    ngOnInit() {

        console.log(this.defaults);
        this.empleadoTransporte = this.defaults.payload;

        if (this.empleadoTransporte.id) {
            this.mode = 'global.edit';
        } else {
            this.defaults = {} as any;
        }

        this.buildForm(this.empleadoTransporte)

    }

    buildForm(empleadoTransporte: EmpleadoTransporte) {

        this.itemForm = this.fb.group({
            id: new FormControl({ value: empleadoTransporte.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(empleadoTransporte.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            cedula: new FormControl(empleadoTransporte.cedula || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });

        // this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;



        this.updateData(this.empleadoTransporte);
        // this.empleadoTransporte.transportista = this.transportista;
        console.log(this.empleadoTransporte);
        this.saveOrUpdate(this.empleadoTransporteService, this.empleadoTransporte, 'El Empleado', this.isNew);
    }

}
