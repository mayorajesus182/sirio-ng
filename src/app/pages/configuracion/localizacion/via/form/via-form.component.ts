import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Via, ViaService } from 'src/@sirio/domain/services/configuracion/localizacion/via.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-via-form',
    templateUrl: './via-form.component.html',
    styleUrls: ['./via-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ViaFormComponent extends FormBaseComponent implements OnInit {

    via: Via = {} as Via;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private viaService: ViaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.viaService.get(id).subscribe((agn: Via) => {
                this.via = agn;
                this.buildForm(this.via);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.via);
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

    buildForm(via: Via) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: via.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(via.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(via.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.via);
        this.saveOrUpdate(this.viaService, this.via, 'El Via', this.isNew);
    }

    private codigoExists(id) {
        this.viaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.via.id) {
            this.applyChangeStatus(this.viaService, this.via, this.via.nombre, this.cdr);
        }
    }

}
