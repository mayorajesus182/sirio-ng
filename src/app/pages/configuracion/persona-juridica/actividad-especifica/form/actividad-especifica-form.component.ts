import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { ActividadEspecifica, ActividadEspecificaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-actividad-especifica-form',
    templateUrl: './actividad-especifica-form.component.html',
    styleUrls: ['./actividad-especifica-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ActividadEspecificaFormComponent extends FormBaseComponent implements OnInit {

    actividadEspecifica: ActividadEspecifica = {} as ActividadEspecifica;
    public actividadesEconomicas = new BehaviorSubject<ActividadEconomica[]>([]);
    
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private actividadEspecificaService: ActividadEspecificaService,
        private actividadEconomicaService: ActividadEconomicaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.actividadEspecificaService.get(id).subscribe((agn: ActividadEspecifica) => {
                this.actividadEspecifica = agn;
                this.buildForm(this.actividadEspecifica);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.actividadEspecifica);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.actividadEconomicaService.actives().subscribe(data => {
            this.actividadesEconomicas.next(data);
        });

    }

    buildForm(actividadEspecifica: ActividadEspecifica) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: actividadEspecifica.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(actividadEspecifica.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            actividadEconomica: [actividadEspecifica.actividadEconomica || undefined, [Validators.required]],
            codigoLocal: new FormControl(actividadEspecifica.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.actividadEspecifica);
        this.saveOrUpdate(this.actividadEspecificaService, this.actividadEspecifica, 'La Actividad Especifica', this.isNew);
    }

    private codigoExists(id) {
        this.actividadEspecificaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.actividadEspecifica.id) {
            this.applyChangeStatus(this.actividadEspecificaService, this.actividadEspecifica, this.actividadEspecifica.nombre, this.cdr);
        }
    }

}
