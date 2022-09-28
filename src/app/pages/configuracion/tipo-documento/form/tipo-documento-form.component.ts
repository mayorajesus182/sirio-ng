import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { TipoPersona, TipoPersonaService } from 'src/@sirio/domain/services/configuracion/tipo-persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-documento-form',
    templateUrl: './tipo-documento-form.component.html',
    styleUrls: ['./tipo-documento-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoDocumentoFormComponent extends FormBaseComponent implements OnInit {

    tipoDocumento: TipoDocumento = {} as TipoDocumento;
    public tiposPersonas = new BehaviorSubject<TipoPersona[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoDocumentoService: TipoDocumentoService,
        private tipoPersonaService: TipoPersonaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoDocumentoService.get(id).subscribe((agn: TipoDocumento) => {
                this.tipoDocumento = agn;
                this.buildForm(this.tipoDocumento);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoDocumento);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.tipoPersonaService.actives().subscribe(data => {
            this.tiposPersonas.next(data);
        });

    }

    buildForm(tipoDocumento: TipoDocumento) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoDocumento.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(tipoDocumento.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            tipoPersona: new FormControl(tipoDocumento.tipoPersona || undefined, [Validators.required]),
            codigoLocal: new FormControl(tipoDocumento.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoDocumento);
        this.saveOrUpdate(this.tipoDocumentoService, this.tipoDocumento, 'El Tipo de Documento', this.isNew);
    }

    private codigoExists(id) {
        this.tipoDocumentoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoDocumento.id) {
            this.applyChangeStatus(this.tipoDocumentoService, this.tipoDocumento, this.tipoDocumento.nombre, this.cdr);
        }
    }

}
