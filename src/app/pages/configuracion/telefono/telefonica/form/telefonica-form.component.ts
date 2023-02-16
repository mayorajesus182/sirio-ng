import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Telefonica, TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { TipoTelefonica, TipoTelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefonica.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-telefonica-form',
    templateUrl: './telefonica-form.component.html',
    styleUrls: ['./telefonica-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TelefonicaFormComponent extends FormBaseComponent implements OnInit {

    telefonica: Telefonica = {} as Telefonica;
    public tipos = new BehaviorSubject<TipoTelefonica[]>([]);


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private telefonicaService: TelefonicaService,
        private tipoTelefonicaService: TipoTelefonicaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.telefonicaService.get(id).subscribe((agn: Telefonica) => {
                this.telefonica = agn;
                this.buildForm(this.telefonica);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.telefonica);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.tipoTelefonicaService.actives().subscribe(data => {
            this.tipos.next(data);
        });

    }

    buildForm(telefonica: Telefonica) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: telefonica.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            nombre: new FormControl(telefonica.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            tipoTelefonica: new FormControl(telefonica.tipoTelefonica || undefined, [Validators.required]),
            codigoLocal: new FormControl(telefonica.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.telefonica);
        
        this.saveOrUpdate(this.telefonicaService, this.telefonica, 'El Telefónica', this.isNew);
    }

    private codigoExists(id) {
        this.telefonicaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.telefonica.id) {
            this.applyChangeStatus(this.telefonicaService, this.telefonica, this.telefonica.nombre, this.cdr);
        }
    }

}
