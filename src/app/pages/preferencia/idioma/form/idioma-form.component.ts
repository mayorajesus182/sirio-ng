import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Idioma, IdiomaService } from 'src/@sirio/domain/services/preferencias/idioma.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'sirio-idioma-form',
    templateUrl: './idioma-form.component.html',
    styleUrls: ['./idioma-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class IdiomaFormComponent extends FormBaseComponent implements OnInit {

    idioma: Idioma = {} as Idioma;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private idiomaService: IdiomaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.idiomaService.get(id).subscribe((agn: Idioma) => {
                this.idioma = agn;
                this.buildForm(this.idioma);
                this.loadingDataForm.next(false);
                this.cdr.markForCheck();
            });
        } else {
            this.buildForm(this.idioma);
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

    buildForm(idioma: Idioma) {

        console.log('idioma ', idioma);
        
        this.itemForm = this.fb.group({
            id: [{value: idioma.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            nombre: [idioma.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]],
            icono: [idioma.icono || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA)]],
        });

        this.printErrors()
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.idioma);
        this.saveOrUpdate(this.idiomaService, this.idioma, 'El Idioma', this.isNew);
    }

    private codigoExists(id) {
        this.idiomaService.exists(id).subscribe(data => {
            console.log('lang exists', data.exists)
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.idioma.id) {
            this.applyChangeStatus(this.idiomaService, this.idioma, this.idioma.nombre, this.cdr);
        }
    }

}
