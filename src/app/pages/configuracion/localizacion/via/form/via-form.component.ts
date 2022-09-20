import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { RegularExpConstants } from 'app/shared/constants/regularexp.constants';
import { Via, ViaService } from 'app/shared/domain/services/configuracion/localizacion/via.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
    selector: 'app-via-form',
    templateUrl: './via-form.component.html',
    styleUrls: ['./via-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: appAnimations
})

export class ViaFormComponent extends FormBaseComponent implements OnInit {

    via: Via = {} as Via;

    a: PerfectScrollbar;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        snack: SnackbarService,
        spinner: NgxSpinnerService,
        swal: SweetAlertService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private viaService: ViaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
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
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.via);
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

    buildForm(via: Via) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: via.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(via.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(via.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.via);
        this.saveOrUpdate(this.viaService, this.via, 'La Vía', this.isNew);
    }

    private codigoExists(id) {
        this.viaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
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
