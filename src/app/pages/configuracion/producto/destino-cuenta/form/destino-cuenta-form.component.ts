import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { DestinoCuenta, DestinoCuentaService } from 'src/@sirio/domain/services/configuracion/producto/destino-cuenta.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-destino-cuenta-form',
    templateUrl: './destino-cuenta-form.component.html',
    styleUrls: ['./destino-cuenta-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DestinoCuentaFormComponent extends FormBaseComponent implements OnInit {

    destinoCuenta: DestinoCuenta = {} as DestinoCuenta;


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private destinoCuentaService: DestinoCuentaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.destinoCuentaService.get(id).subscribe((agn: DestinoCuenta) => {
                this.destinoCuenta = agn;
                this.buildForm(this.destinoCuenta);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.destinoCuenta);
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

    buildForm(destinoCuenta: DestinoCuenta) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: destinoCuenta.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(destinoCuenta.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(destinoCuenta.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.destinoCuenta);
        this.saveOrUpdate(this.destinoCuentaService, this.destinoCuenta, 'La Cifra Promedio', this.isNew);
    }

    private codigoExists(id) {
        this.destinoCuentaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.destinoCuenta.id) {
            this.applyChangeStatus(this.destinoCuentaService, this.destinoCuenta, this.destinoCuenta.nombre, this.cdr);
        }
    }

}
