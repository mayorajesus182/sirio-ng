import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { SnackbarService } from 'src/@sirio/services/snackbar.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-estado-form',
    templateUrl: './estado-form.component.html',
    styleUrls: ['./estado-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EstadoFormComponent extends FormBaseComponent implements OnInit {

    estado: Estado = {} as Estado;
    public paises = new BehaviorSubject<Pais[]>([]);


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private estadoService: EstadoService,
        private paisService: PaisService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.estadoService.get(id).subscribe((agn: Estado) => {
                this.estado = agn;
                this.buildForm(this.estado);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.estado);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.paisService.actives().subscribe(data => {
            this.paises.next(data);
        });

    }

    buildForm(estado: Estado) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: estado.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(estado.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            pais: new FormControl(estado.pais || undefined, [Validators.required]),
            codigoLocal: new FormControl(estado.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.estado);
        this.saveOrUpdate(this.estadoService, this.estado, 'El Estado', this.isNew);
    }

    private codigoExists(id) {
        this.estadoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.estado.id) {
            this.applyChangeStatus(this.estadoService, this.estado, this.estado.nombre, this.cdr);
        }
    }

}
