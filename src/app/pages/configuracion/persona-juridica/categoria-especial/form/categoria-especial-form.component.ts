import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { CategoriaEspecial, CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-categoria-especial-form',
    templateUrl: './categoria-especial-form.component.html',
    styleUrls: ['./categoria-especial-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CategoriaEspecialFormComponent extends FormBaseComponent implements OnInit {

    categoriaEspecial: CategoriaEspecial = {} as CategoriaEspecial;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private categoriaEspecialService: CategoriaEspecialService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.categoriaEspecialService.get(id).subscribe((agn: CategoriaEspecial) => {
                this.categoriaEspecial = agn;
                this.buildForm(this.categoriaEspecial);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.categoriaEspecial);
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

    buildForm(categoriaEspecial: CategoriaEspecial) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: categoriaEspecial.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(categoriaEspecial.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(categoriaEspecial.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.categoriaEspecial);
        this.saveOrUpdate(this.categoriaEspecialService, this.categoriaEspecial, 'La Forma Juridica', this.isNew);
    }

    private codigoExists(id) {
        this.categoriaEspecialService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.categoriaEspecial.id) {
            this.applyChangeStatus(this.categoriaEspecialService, this.categoriaEspecial, this.categoriaEspecial.nombre, this.cdr);
        }
    }

}
