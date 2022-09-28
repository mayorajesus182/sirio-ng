import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Region, RegionService } from 'src/@sirio/domain/services/organizacion/region.service';
import { Zona, ZonaService } from 'src/@sirio/domain/services/organizacion/zona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-region-form',
    templateUrl: './region-form.component.html',
    styleUrls: ['./region-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RegionFormComponent extends FormBaseComponent implements OnInit {

    region: Region = {} as Region;
    public zonas = new BehaviorSubject<Zona[]>([]);


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private regionService: RegionService,
        private zonaService: ZonaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.regionService.get(id).subscribe((agn: Region) => {
                this.region = agn;
                this.buildForm(this.region);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.region);
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
        });

    }

    buildForm(region: Region) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: region.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)]),
            nombre: new FormControl(region.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            zona: new FormControl(region.zona || undefined, [Validators.required]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.region);
        this.saveOrUpdate(this.regionService, this.region, 'La Región', this.isNew);
    }

    private codigoExists(id) {
        this.regionService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.region.id) {
            this.applyChangeStatus(this.regionService, this.region, this.region.nombre, this.cdr);
        }
    }

}
