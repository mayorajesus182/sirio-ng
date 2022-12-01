import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { CifraPromedio, CifraPromedioService } from 'src/@sirio/domain/services/configuracion/producto/cifra-promedio.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cifra-promedio-form',
    templateUrl: './cifra-promedio-form.component.html',
    styleUrls: ['./cifra-promedio-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CifraPromedioFormComponent extends FormBaseComponent implements OnInit {

    cifraPromedio: CifraPromedio = {} as CifraPromedio;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private cifraPromedioService: CifraPromedioService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.cifraPromedioService.get(id).subscribe((agn: CifraPromedio) => {
                this.cifraPromedio = agn;
                this.buildForm(this.cifraPromedio);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.cifraPromedio);
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

    buildForm(cifraPromedio: CifraPromedio) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: cifraPromedio.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(cifraPromedio.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(cifraPromedio.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cifraPromedio);
        this.saveOrUpdate(this.cifraPromedioService, this.cifraPromedio, 'La Cifra Promedio', this.isNew);
    }

    private codigoExists(id) {
        this.cifraPromedioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.cifraPromedio.id) {
            this.applyChangeStatus(this.cifraPromedioService, this.cifraPromedio, this.cifraPromedio.nombre, this.cdr);
        }
    }

}
