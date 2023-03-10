import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ClaseTelefono, ClaseTelefonoService } from 'src/@sirio/domain/services/configuracion/telefono/clase-telefono.service';
import { TipoTelefonica, TipoTelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefonica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-clase-telefono-form',
    templateUrl: './clase-telefono-form.component.html',
    styleUrls: ['./clase-telefono-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ClaseTelefonoFormComponent extends FormBaseComponent implements OnInit {

    claseTelefono: ClaseTelefono = {} as ClaseTelefono;
    public tipos = new BehaviorSubject<TipoTelefonica[]>([]);


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private ClaseTelefonoService: ClaseTelefonoService,
        private tipoTelefonicaService: TipoTelefonicaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.ClaseTelefonoService.get(id).subscribe((agn: ClaseTelefono) => {
                this.claseTelefono = agn;
                this.buildForm(this.claseTelefono);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.claseTelefono);
            this.loadingDataForm.next(false);
        }

        this.tipoTelefonicaService.actives().subscribe(data => {
            this.tipos.next(data);
        });

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }

    buildForm(claseTelefono: ClaseTelefono) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: claseTelefono.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(claseTelefono.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            tipoTelefonica: new FormControl(claseTelefono.tipoTelefonica || undefined, [Validators.required]),
            codigoLocal: new FormControl(claseTelefono.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.claseTelefono);

        console.log(this.claseTelefono);
        
        this.saveOrUpdate(this.ClaseTelefonoService, this.claseTelefono, 'La Clase de Tel??fono', this.isNew);
    }

    private codigoExists(id) {
        this.ClaseTelefonoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.claseTelefono.id) {
            this.applyChangeStatus(this.ClaseTelefonoService, this.claseTelefono, this.claseTelefono.nombre, this.cdr);
        }
    }

}
