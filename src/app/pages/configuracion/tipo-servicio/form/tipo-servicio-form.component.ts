import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoPersona, TipoPersonaService } from 'src/@sirio/domain/services/configuracion/tipo-persona.service';
import { TipoServicio, TipoServicioService } from 'src/@sirio/domain/services/configuracion/servicio-comercial.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-servicio-form',
    templateUrl: './tipo-servicio-form.component.html',
    styleUrls: ['./tipo-servicio-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoServicioFormComponent extends FormBaseComponent implements OnInit {

    tipoServicio: TipoServicio = {} as TipoServicio;
    public tipoPersonas = new BehaviorSubject<TipoPersona[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    constants = GlobalConstants;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoServicioService: TipoServicioService,
        private tipoPersonaService: TipoPersonaService,
        private monedaService: MonedaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoServicioService.get(id).subscribe((agn: TipoServicio) => {
                this.tipoServicio = agn;
                this.buildForm(this.tipoServicio);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoServicio);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.monedaService.actives().subscribe(data => {
            this.monedas.next(data);
        });

        this.tipoPersonaService.actives().subscribe(data => {
            this.tipoPersonas.next(data);
        });
    }

    buildForm(tipoServicio: TipoServicio) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoServicio.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(tipoServicio.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            tipoPersona: new FormControl(tipoServicio.tipoPersona || undefined, [Validators.required]),
            moneda: new FormControl(tipoServicio.moneda || undefined, [Validators.required]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoServicio);
        this.saveOrUpdate(this.tipoServicioService, this.tipoServicio, 'El Tipo de Servicio', this.isNew);
    }

    private codigoExists(id) {
        this.tipoServicioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: 'El código existe'
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoServicio.id) {
            this.applyChangeStatus(this.tipoServicioService, this.tipoServicio, this.tipoServicio.nombre, this.cdr);
        }
    }

}
