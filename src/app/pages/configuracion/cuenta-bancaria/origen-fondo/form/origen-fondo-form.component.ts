import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { OrigenFondo, OrigenFondoService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/origen-fondo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-origen-fondo-form',
    templateUrl: './origen-fondo-form.component.html',
    styleUrls: ['./origen-fondo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class OrigenFondoFormComponent extends FormBaseComponent implements OnInit {

    origenFondo: OrigenFondo = {} as OrigenFondo;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private origenFondoService: OrigenFondoService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.origenFondoService.get(id).subscribe((agn: OrigenFondo) => {
                this.origenFondo = agn;
                this.buildForm(this.origenFondo);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.origenFondo);
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

    buildForm(origenFondo: OrigenFondo) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: origenFondo.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(origenFondo.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(origenFondo.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.origenFondo);
        this.saveOrUpdate(this.origenFondoService, this.origenFondo, 'La Cifra Promedio', this.isNew);
    }

    private codigoExists(id) {
        this.origenFondoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.origenFondo.id) {
            this.applyChangeStatus(this.origenFondoService, this.origenFondo, this.origenFondo.nombre, this.cdr);
        }
    }

}
