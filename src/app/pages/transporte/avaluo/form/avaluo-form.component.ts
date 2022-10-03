import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Avaluo, AvaluoService } from 'src/@sirio/domain/services/transporte/avaluo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-avaluo-form',
    templateUrl: './avaluo-form.component.html',
    styleUrls: ['./avaluo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AvaluoFormComponent extends FormBaseComponent implements OnInit {

    avaluo: Avaluo = {} as Avaluo;


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private avaluoService: AvaluoService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.avaluoService.get(id).subscribe((agn: Avaluo) => {
                this.avaluo = agn;
                this.buildForm(this.avaluo);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.avaluo);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }

    buildForm(avaluo: Avaluo) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: avaluo.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(avaluo.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.avaluo);
        this.saveOrUpdate(this.avaluoService, this.avaluo, 'El Avaluo', this.isNew);
    }

    private codigoExists(id) {
        this.avaluoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.avaluo.id) {
            this.applyChangeStatus(this.avaluoService, this.avaluo, this.avaluo.nombre, this.cdr);
        }
    }

}
