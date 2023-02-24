import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/tipo-firmante.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-firmante-form',
    templateUrl: './tipo-firmante-form.component.html',
    styleUrls: ['./tipo-firmante-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoFirmanteFormComponent extends FormBaseComponent implements OnInit {

    tipoFirmante: TipoFirmante = {} as TipoFirmante;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoFirmanteService: TipoFirmanteService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoFirmanteService.get(id).subscribe((agn: TipoFirmante) => {
                this.tipoFirmante = agn;
                this.buildForm(this.tipoFirmante);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoFirmante);
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

    buildForm(tipoFirmante: TipoFirmante) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoFirmante.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(tipoFirmante.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(tipoFirmante.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoFirmante);
        this.saveOrUpdate(this.tipoFirmanteService, this.tipoFirmante, 'La Cifra Promedio', this.isNew);
    }

    private codigoExists(id) {
        this.tipoFirmanteService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoFirmante.id) {
            this.applyChangeStatus(this.tipoFirmanteService, this.tipoFirmante, this.tipoFirmante.nombre, this.cdr);
        }
    }

}
