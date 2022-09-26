import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-actividad-economica-form',
    templateUrl: './actividad-economica-form.component.html',
    styleUrls: ['./actividad-economica-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ActividadEconomicaFormComponent extends FormBaseComponent implements OnInit {

    actividadEconomica: ActividadEconomica = {} as ActividadEconomica;
    
    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private actividadEconomicaService: ActividadEconomicaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.actividadEconomicaService.get(id).subscribe((agn: ActividadEconomica) => {
                this.actividadEconomica = agn;
                this.buildForm(this.actividadEconomica);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.actividadEconomica);
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

    buildForm(actividadEconomica: ActividadEconomica) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: actividadEconomica.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(actividadEconomica.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(actividadEconomica.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.actividadEconomica);
        this.saveOrUpdate(this.actividadEconomicaService, this.actividadEconomica, 'La Actividad Economica', this.isNew);
    }

    private codigoExists(id) {
        this.actividadEconomicaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.actividadEconomica.id) {
            this.applyChangeStatus(this.actividadEconomicaService, this.actividadEconomica, this.actividadEconomica.nombre, this.cdr);
        }
    }

}
