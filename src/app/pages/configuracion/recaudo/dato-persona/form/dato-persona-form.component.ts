import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { DatoPersona, DatoPersonaService } from 'src/@sirio/domain/services/configuracion/recaudo/dato-persona.service';
import { SeccionPersona, SeccionPersonaService } from 'src/@sirio/domain/services/configuracion/recaudo/seccion-persona.service';
import { TipoPersona, TipoPersonaService } from 'src/@sirio/domain/services/configuracion/tipo-persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-dato-persona-form',
    templateUrl: './dato-persona-form.component.html',
    styleUrls: ['./dato-persona-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DatoPersonaFormComponent extends FormBaseComponent implements OnInit {

    datoPersona: DatoPersona = {} as DatoPersona;
    public tipoPersonas = new BehaviorSubject<TipoPersona[]>([]);
    public secciones = new BehaviorSubject<SeccionPersona[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private datoPersonaService: DatoPersonaService,
        private tipoPersonaService: TipoPersonaService,
        private seccionPersonaService: SeccionPersonaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let tipoPersona = this.route.snapshot.params['tipoPersona'];
        let seccion = this.route.snapshot.params['seccion'];
        this.isNew = tipoPersona == undefined;
        this.loadingDataForm.next(true);

        this.tipoPersonaService.actives().subscribe(data => {
            this.tipoPersonas.next(data);
            console.log('  tipoPersonas  ', data);

        });

        this.seccionPersonaService.actives().subscribe(data => {
            this.secciones.next(data);
        });

        if (tipoPersona) {
            this.datoPersonaService.get(tipoPersona, seccion).subscribe((elem: DatoPersona) => {
                this.datoPersona = elem;
                this.buildForm(this.datoPersona);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.datoPersona);
            this.loadingDataForm.next(false);
        }
    }

    buildForm(datoPersona: DatoPersona) {
        this.itemForm = this.fb.group({
            tipoPersona: new FormControl(datoPersona.tipoPersona || undefined, [Validators.required]),
            seccion: new FormControl(datoPersona.seccion || undefined, [Validators.required]),
            cantidad: new FormControl(datoPersona.cantidad || undefined, [Validators.required])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.datoPersona);
        this.saveOrUpdate(this.datoPersonaService, this.datoPersona, 'La información', this.isNew);
    }

}
