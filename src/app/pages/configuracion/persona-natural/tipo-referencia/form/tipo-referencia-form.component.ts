import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoReferencia, TipoReferenciaService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-referencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-referencia-form',
    templateUrl: './tipo-referencia-form.component.html',
    styleUrls: ['./tipo-referencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoReferenciaFormComponent extends FormBaseComponent implements OnInit {

    tipoReferencia: TipoReferencia = {} as TipoReferencia;
    
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoReferenciaService: TipoReferenciaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoReferenciaService.get(id).subscribe((agn: TipoReferencia) => {
                this.tipoReferencia = agn;
                this.buildForm(this.tipoReferencia);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoReferencia);
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

    buildForm(tipoReferencia: TipoReferencia) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoReferencia.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(tipoReferencia.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(tipoReferencia.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoReferencia);
        this.saveOrUpdate(this.tipoReferenciaService, this.tipoReferencia, 'La Actividad Economica', this.isNew);
    }

    private codigoExists(id) {
        this.tipoReferenciaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoReferencia.id) {
            this.applyChangeStatus(this.tipoReferenciaService, this.tipoReferencia, this.tipoReferencia.nombre, this.cdr);
        }
    }

}
