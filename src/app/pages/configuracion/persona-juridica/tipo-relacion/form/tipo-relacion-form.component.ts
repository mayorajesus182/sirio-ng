import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoRelacion, TipoRelacionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/tipo-relacion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-relacion-form',
    templateUrl: './tipo-relacion-form.component.html',
    styleUrls: ['./tipo-relacion-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoRelacionFormComponent extends FormBaseComponent implements OnInit {

    tipoRelacion: TipoRelacion = {} as TipoRelacion;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoRelacionService: TipoRelacionService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoRelacionService.get(id).subscribe((agn: TipoRelacion) => {
                this.tipoRelacion = agn;
                this.buildForm(this.tipoRelacion);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoRelacion);
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

    buildForm(tipoRelacion: TipoRelacion) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoRelacion.id || '',  disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(tipoRelacion.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(tipoRelacion.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoRelacion);
        this.saveOrUpdate(this.tipoRelacionService, this.tipoRelacion, 'El Tipo de Relación', this.isNew);
    }

    private codigoExists(id) {
        this.tipoRelacionService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoRelacion.id) {
            this.applyChangeStatus(this.tipoRelacionService, this.tipoRelacion, this.tipoRelacion.nombre, this.cdr);
        }
    }

}
