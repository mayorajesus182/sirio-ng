import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Sector, SectorService } from 'src/@sirio/domain/services/configuracion/persona-juridica/sector.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-sector-form',
    templateUrl: './sector-form.component.html',
    styleUrls: ['./sector-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SectorFormComponent extends FormBaseComponent implements OnInit {

    sector: Sector = {} as Sector;
    public tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private sectorService: SectorService,
        private tipoDocumentoService: TipoDocumentoService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.sectorService.get(id).subscribe((agn: Sector) => {
                this.sector = agn;
                this.buildForm(this.sector);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.sector);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.tipoDocumentoService.actives().subscribe(data => {
            this.tipoDocumentos.next(data);
        });

    }

    buildForm(sector: Sector) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: sector.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(sector.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
            tipoDocumento: new FormControl(sector.tipoDocumento || undefined, [Validators.required]),
            codigoLocal: new FormControl(sector.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.sector);
        this.saveOrUpdate(this.sectorService, this.sector, 'El Sector', this.isNew);
    }

    private codigoExists(id) {
        this.sectorService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.sector.id) {
            this.applyChangeStatus(this.sectorService, this.sector, this.sector.nombre, this.cdr);
        }
    }

}
