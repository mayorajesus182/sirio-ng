import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { NivelPersona, NivelPersonaService } from 'src/@sirio/domain/services/configuracion/recaudo/nivel-persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-nivel-persona-form',
    templateUrl: './nivel-persona-form.component.html',
    styleUrls: ['./nivel-persona-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class NivelPersonaFormComponent extends FormBaseComponent implements OnInit {

    nivelPersona: NivelPersona = {} as NivelPersona;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private nivelPersonaService: NivelPersonaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.nivelPersonaService.get(id).subscribe((elem: NivelPersona) => {
                this.nivelPersona = elem;
                this.buildForm(this.nivelPersona);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.nivelPersona);
            this.loadingDataForm.next(false);
        }

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }

    buildForm(nivelPersona: NivelPersona) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: nivelPersona.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(nivelPersona.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(nivelPersona.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.nivelPersona);
        this.saveOrUpdate(this.nivelPersonaService, this.nivelPersona, 'El Nivel', this.isNew);
    }

    private codigoExists(id) {
        this.nivelPersonaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.nivelPersona.id) {
            this.applyChangeStatus(this.nivelPersonaService, this.nivelPersona, this.nivelPersona.nombre, this.cdr);
        }
    }

}
