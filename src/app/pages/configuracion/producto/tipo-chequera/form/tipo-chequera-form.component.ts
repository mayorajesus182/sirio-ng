import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TipoChequera, TipoChequeraService } from 'src/@sirio/domain/services/configuracion/producto/tipo-chequera.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-chequera-form',
    templateUrl: './tipo-chequera-form.component.html',
    styleUrls: ['./tipo-chequera-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoChequeraFormComponent extends FormBaseComponent implements OnInit {

    tipoChequera: TipoChequera = {} as TipoChequera;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoChequeraService: TipoChequeraService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoChequeraService.get(id).subscribe((agn: TipoChequera) => {
                this.tipoChequera = agn;
                this.buildForm(this.tipoChequera);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoChequera);
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

    buildForm(tipoChequera: TipoChequera) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoChequera.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(tipoChequera.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(tipoChequera.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoChequera);
        this.saveOrUpdate(this.tipoChequeraService, this.tipoChequera, 'La Cifra Promedio', this.isNew);
    }

    private codigoExists(id) {
        this.tipoChequeraService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoChequera.id) {
            this.applyChangeStatus(this.tipoChequeraService, this.tipoChequera, this.tipoChequera.nombre, this.cdr);
        }
    }

}
