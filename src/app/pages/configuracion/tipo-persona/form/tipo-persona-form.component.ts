import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoPersona, TipoPersonaService } from 'src/@sirio/domain/services/configuracion/tipo-persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-persona-form',
    templateUrl: './tipo-persona-form.component.html',
    styleUrls: ['./tipo-persona-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoPersonaFormComponent extends FormBaseComponent implements OnInit {

    tipoPersona: TipoPersona = {} as TipoPersona;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoPersonaService: TipoPersonaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoPersonaService.get(id).subscribe((agn: TipoPersona) => {
                this.tipoPersona = agn;
                this.buildForm(this.tipoPersona);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoPersona);
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

    buildForm(tipoPersona: TipoPersona) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoPersona.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(tipoPersona.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(tipoPersona.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoPersona);
        this.saveOrUpdate(this.tipoPersonaService, this.tipoPersona, 'El Tipo de Persona', this.isNew);
    }

    private codigoExists(id) {
        this.tipoPersonaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoPersona.id) {
            this.applyChangeStatus(this.tipoPersonaService, this.tipoPersona, this.tipoPersona.nombre, this.cdr);
        }
    }

}
