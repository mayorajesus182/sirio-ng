import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private empleadoTransporteService: EmpleadoTransporteService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        this.transportista = this.route.snapshot.params['id'];
        this.isNew = this.transportista == undefined;

        if (this.transportista) {
            this.empleadoTransporteService.get(this.transportista).subscribe((agn: EmpleadoTransporte) => {
                this.empleadoTransporte = agn;
                this.buildForm(this.empleadoTransporte);
                this.cdr.markForCheck();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.empleadoTransporte);
        }
    }

    buildForm(empleadoTransporte: EmpleadoTransporte) {
       
        this.itemForm = this.fb.group({
            id: new FormControl({value: empleadoTransporte.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(empleadoTransporte.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            rif: new FormControl(empleadoTransporte.cedula || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });

        this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.empleadoTransporte);
        this.empleadoTransporte.transportista = this.transportista;
        this.saveOrUpdate(this.empleadoTransporteService, this.empleadoTransporte, 'El Empleado', this.isNew);
    }

}
