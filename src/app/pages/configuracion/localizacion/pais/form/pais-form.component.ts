import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { Pais, PaisService } from 'app/shared/domain/services/configuracion/localizacion/pais.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { RegularExpConstants } from 'app/shared/constants/regularexp.constants';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-pais-form',
    templateUrl: './pais-form.component.html',
    styleUrls: ['./pais-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: appAnimations
})

export class PaisFormComponent extends FormBaseComponent implements OnInit {

    pais: Pais = {} as Pais;

    a: PerfectScrollbar;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        snack: SnackbarService,
        spinner: NgxSpinnerService,
        swal: SweetAlertService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private paisService: PaisService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.paisService.get(id).subscribe((agn: Pais) => {
                this.pais = agn;
                this.buildForm(this.pais);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.pais);
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

    buildForm(pais: Pais) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: pais.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(pais.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(pais.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            gentilicio: new FormControl(pais.gentilicio || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.pais);
        this.saveOrUpdate(this.paisService, this.pais, 'El País', this.isNew);
    }

    private codigoExists(id) {
        this.paisService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.pais.id) {
            this.applyChangeStatus(this.paisService, this.pais, this.pais.nombre, this.cdr);
        }
    }

}
