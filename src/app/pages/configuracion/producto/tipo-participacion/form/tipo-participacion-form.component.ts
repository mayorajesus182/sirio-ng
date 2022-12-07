import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-participacion-form',
    templateUrl: './tipo-participacion-form.component.html',
    styleUrls: ['./tipo-participacion-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoParticipacionFormComponent extends FormBaseComponent implements OnInit {

    tipoParticipacion: TipoParticipacion = {} as TipoParticipacion;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoParticipacionService: TipoParticipacionService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoParticipacionService.get(id).subscribe((agn: TipoParticipacion) => {
                this.tipoParticipacion = agn;
                this.buildForm(this.tipoParticipacion);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoParticipacion);
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

    buildForm(tipoParticipacion: TipoParticipacion) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoParticipacion.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(tipoParticipacion.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(tipoParticipacion.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoParticipacion);
        this.saveOrUpdate(this.tipoParticipacionService, this.tipoParticipacion, 'El Tipo de Participación', this.isNew);
    }

    private codigoExists(id) {
        this.tipoParticipacionService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoParticipacion.id) {
            this.applyChangeStatus(this.tipoParticipacionService, this.tipoParticipacion, this.tipoParticipacion.nombre, this.cdr);
        }
    }

}
