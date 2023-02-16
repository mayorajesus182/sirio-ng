import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { FormaJuridica, FormaJuridicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/forma-juridica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-forma-juridica-form',
    templateUrl: './forma-juridica-form.component.html',
    styleUrls: ['./forma-juridica-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class FormaJuridicaFormComponent extends FormBaseComponent implements OnInit {

    formaJuridica: FormaJuridica = {} as FormaJuridica;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private formaJuridicaService: FormaJuridicaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.formaJuridicaService.get(id).subscribe((agn: FormaJuridica) => {
                this.formaJuridica = agn;
                this.buildForm(this.formaJuridica);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.formaJuridica);
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

    buildForm(formaJuridica: FormaJuridica) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: formaJuridica.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(formaJuridica.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(formaJuridica.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.formaJuridica);
        this.saveOrUpdate(this.formaJuridicaService, this.formaJuridica, 'La Forma Juridica', this.isNew);
    }

    private codigoExists(id) {
        this.formaJuridicaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.formaJuridica.id) {
            this.applyChangeStatus(this.formaJuridicaService, this.formaJuridica, this.formaJuridica.nombre, this.cdr);
        }
    }

}
