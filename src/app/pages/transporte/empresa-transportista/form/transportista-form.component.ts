import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Zona, ZonaService } from 'src/@sirio/domain/services/organizacion/zona.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-transportista-form',
    templateUrl: './transportista-form.component.html',
    styleUrls: ['./transportista-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TransportistaFormComponent extends FormBaseComponent implements OnInit {

    transportista: Transportista = {} as Transportista;
    public zonas = new BehaviorSubject<Zona[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private transportistaService: TransportistaService,
        private zonaService: ZonaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.transportistaService.get(id).subscribe((agn: Transportista) => {
                this.transportista = agn;
                this.buildForm(this.transportista);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.transportista);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.zonaService.actives().subscribe(data => {
            this.zonas.next(data);
            this.cdr.detectChanges();
        });
    }

    buildForm(transportista: Transportista) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: transportista.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(transportista.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            rif: new FormControl(transportista.rif || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            zona: [transportista.zona || undefined, [Validators.required]],
            direccion:  [transportista.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            email:  [transportista.email || '', [Validators.required]],
            telefono:  [transportista.telefono || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]],
            telefonoAlt:  [transportista.telefonoAlt || '', Validators.pattern(RegularExpConstants.NUMERIC)],
            latitud:  [transportista.latitud || undefined, [Validators.required]],
            longitud:  [transportista.longitud || undefined, [Validators.required]],
        });
    }

   


    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.transportista);
        this.saveOrUpdate(this.transportistaService, this.transportista, 'El Transportista', this.isNew);
    }

    private codigoExists(id) {
        this.transportistaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.transportista.id) {
            this.applyChangeStatus(this.transportistaService, this.transportista, this.transportista.nombre, this.cdr);
        }
    }

}
