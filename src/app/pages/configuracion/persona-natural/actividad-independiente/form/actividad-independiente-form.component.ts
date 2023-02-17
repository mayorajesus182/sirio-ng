import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ActividadIndependiente, ActividadIndependienteService } from 'src/@sirio/domain/services/configuracion/persona-natural/actividad-independiente.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-actividad-independiente-form',
    templateUrl: './actividad-independiente-form.component.html',
    styleUrls: ['./actividad-independiente-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ActividadIndependienteFormComponent extends FormBaseComponent implements OnInit {

    actividadIndependiente: ActividadIndependiente = {} as ActividadIndependiente;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private actividadIndependienteService: ActividadIndependienteService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.actividadIndependienteService.get(id).subscribe((agn: ActividadIndependiente) => {
                this.actividadIndependiente = agn;
                this.buildForm(this.actividadIndependiente);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.actividadIndependiente);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

    }

    buildForm(actividadIndependiente: ActividadIndependiente) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: actividadIndependiente.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(actividadIndependiente.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(actividadIndependiente.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.actividadIndependiente);
        this.saveOrUpdate(this.actividadIndependienteService, this.actividadIndependiente, 'La Actividad Independiente', this.isNew);
    }

    private codigoExists(id) {
        this.actividadIndependienteService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.actividadIndependiente.id) {
            this.applyChangeStatus(this.actividadIndependienteService, this.actividadIndependiente, this.actividadIndependiente.nombre, this.cdr);
        }
    }

}
