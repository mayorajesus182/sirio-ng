import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { NivelPersona, NivelPersonaService } from 'src/@sirio/domain/services/configuracion/recaudo/nivel-persona.service';
import { TipoRecaudo, TipoRecaudoService } from 'src/@sirio/domain/services/configuracion/recaudo/tipo-recaudo.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-recaudo-form',
    templateUrl: './tipo-recaudo-form.component.html',
    styleUrls: ['./tipo-recaudo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoRecaudoFormComponent extends FormBaseComponent implements OnInit {

    tipoRecaudo: TipoRecaudo = {} as TipoRecaudo;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public nivelPersonas = new BehaviorSubject<NivelPersona[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoRecaudoService: TipoRecaudoService,
        private tipoDocumentoService: TipoDocumentoService,
        private nivelPersonaService: NivelPersonaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        this.tipoDocumentoService.activesNaturales().subscribe(data => {
            this.tipoDocumentos.next(data);
        });

        this.nivelPersonaService.actives().subscribe(data => {
            this.nivelPersonas.next(data);
        });

        if (id) {
            this.tipoRecaudoService.get(id).subscribe((agn:TipoRecaudo) => {
                this.tipoRecaudo = agn;
                this.buildForm(this.tipoRecaudo);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoRecaudo);
            this.loadingDataForm.next(false);
        }

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }




    buildForm(tipoRecaudo: TipoRecaudo) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: tipoRecaudo.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            tipoDocumento: new FormControl(tipoRecaudo.tipoDocumento || undefined, [Validators.required]),
            nombre: new FormControl(tipoRecaudo.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            recaudoMinimo: new FormControl(tipoRecaudo.recaudoMinimo || false),
            niveles: new FormControl(tipoRecaudo.niveles || undefined, [Validators.required]),
            cantidad: new FormControl(tipoRecaudo.cantidad || undefined, [Validators.required]),
            codigoLocal: new FormControl(tipoRecaudo.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoRecaudo);

        this.tipoRecaudo.recaudoMinimo = this.tipoRecaudo.recaudoMinimo ? 1 : 0;
        console.log('this.tipoRecaudo   ', this.tipoRecaudo);

        this.saveOrUpdate(this.tipoRecaudoService, this.tipoRecaudo, 'El Tipo de Recaudo', this.isNew);
    }

    private codigoExists(id) {
        this.tipoRecaudoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoRecaudo.id) {
            this.applyChangeStatus(this.tipoRecaudoService, this.tipoRecaudo, this.tipoRecaudo.nombre, this.cdr);
        }
    }

}
